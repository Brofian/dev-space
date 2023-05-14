import React, {JSX} from "react";
import history from "history/browser";

type RouteList = RouteDefinition[];

type RouteDefinition = {
    id: string,
    url: string,
    component: JSX.Element
}

interface IState {
    status: 'back'|'forward'|'idle'
    prevRoute: RouteDefinition|undefined,
    currentRoute: RouteDefinition,
    nextRoute: RouteDefinition|undefined,
    fallbackRoute: RouteDefinition
}

interface IProps {
    routes: RouteList
}

export default class Router extends React.Component<IProps, IState> {

    static routeList: RouteList = [];

    historyChangedBuffer: {route: RouteDefinition, direction: 'up'|'down'}|undefined = undefined;

    constructor(props: IProps) {
        super(props);

        // store the route List for static use
        Router.routeList = this.props.routes;

        const fallbackRoute = Router.getMatchingRouteDefinition('404') || {id: '404', url: '/404', component: <></>};

        // load the initial route
        const initialRoute = Router.getMatchingPathDefinition(history.location.pathname) || fallbackRoute;

        this.state = {
            status: 'idle',
            prevRoute: undefined,
            currentRoute: initialRoute,
            nextRoute: undefined,
            fallbackRoute: fallbackRoute
        }

        history.listen(this.onHistoryChanged.bind(this));
    }

    static getMatchingRouteDefinition(id: string): RouteDefinition|undefined {
        return Router.routeList.find((route) => {
            return route.id === id;
        });
    }

    static getMatchingPathDefinition(path: string): RouteDefinition|undefined {
        return Router.routeList.find((route) => {
            return route.url === path;
        });
    }

    static linkTo(id: string, state: any = undefined): void {
        const route = this.getMatchingRouteDefinition(id);
        if(route && route.url !== history.location.pathname) {
            history.push(route.url, state);
        }
    }

    onHistoryChanged(): void {
        const newLocation = history.location;
        const newAction = history.action; // PUSH for new entries, POP for moving in the history

        console.log(`now at ${newLocation.pathname} : ${newAction} with`, newLocation.state);

        const newRoute = Router.getMatchingPathDefinition(newLocation.pathname) || this.state.fallbackRoute;

        this.startWindowTransition(newRoute, history.action === 'PUSH' ? 'up' : 'down');
    }

    startWindowTransition(newRoute: RouteDefinition, direction: 'up'|'down'): void {
        if(this.state.status !== 'idle') {
            this.historyChangedBuffer = {
                route: newRoute,
                direction: direction
            }
            return;
        }

        if(direction === 'up') {
            // go forward in history
            this.setState({
                status: 'forward',
                nextRoute: newRoute,
                prevRoute: undefined
            });
        }
        else {
            // go back in history
            this.setState({
                status: 'back',
                nextRoute: undefined,
                prevRoute: newRoute,
            });
        }

        setTimeout(this.onAnimationFinished.bind(this), 1001*2);
    }

    onAnimationFinished(): void {
        const callback = this.historyChangedBuffer ? this.startWindowTransition.bind(this, this.historyChangedBuffer.route, this.historyChangedBuffer.direction) : undefined;
        if(callback) {
            this.historyChangedBuffer = undefined;
        }

        this.setState({
            status: 'idle',
            prevRoute: undefined,
            nextRoute: undefined,
            currentRoute: (this.state.nextRoute || this.state.prevRoute || this.state.fallbackRoute)
        }, callback);
    }

    getAnimationStateClass(): string {
        switch(this.state.status) {
            case 'back':
                return 'slide-down';
            case 'forward':
                return 'slide-up';
            default:
                return '';
        }
    }

    render() {
        return (
            <div className={'page-wrap'}>
                {   this.state.prevRoute &&
                    <div
                        className={`page-screen screen-type-prev ${this.getAnimationStateClass()}`}
                        id={`screen-${this.state.prevRoute.id}`}
                    >
                        {this.state.prevRoute.component}
                    </div>
                }

                {   this.state.currentRoute &&
                    <div
                        className={`page-screen screen-type-active ${this.getAnimationStateClass()}`}
                        id={`screen-${this.state.currentRoute.id}`}
                    >
                        {this.state.currentRoute.component}
                    </div>
                }

                {   this.state.nextRoute &&
                    <div
                        className={`page-screen screen-type-next ${this.getAnimationStateClass()}`}
                        id={`screen-${this.state.nextRoute.id}`}
                    >
                        {this.state.nextRoute.component}
                    </div>
                }
            </div>
        );
    }

}