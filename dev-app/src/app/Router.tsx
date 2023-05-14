import React, {JSX} from "react";
import history from "history/browser";
import {Update} from "history";

type RouteList = RouteDefinition[];

type RouteDefinition = {
    id: string,
    url: string,
    component: JSX.Element
}

type LocationState = {
    [key: string]: any,
    stateId?: number,
    forceDirection?: 'up'|'down'|undefined
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
    static currentStateId: number = 0;


    historyChangedBuffer: {route: RouteDefinition, direction: 'up'|'down'}|undefined = undefined;

    constructor(props: IProps) {
        super(props);

        // store the route List for static use
        Router.routeList = this.props.routes;

        const fallbackRoute = Router.getMatchingRouteDefinition('404') || {id: '404', url: '/404', component: <></>};

        this.state = {
            status: 'idle',
            prevRoute: undefined,
            currentRoute: Router.getMatchingPathDefinition(history.location.pathname) || fallbackRoute,
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

    static linkTo(id: string, state: {[key: string]: any}|undefined = undefined): void {
        const route = Router.getMatchingRouteDefinition(id);

        if(!state || !state.hasOwnProperty('stateId')) {
            state = {
                ...(state || {}),
                stateId: (++Router.currentStateId)
            }
        }

        if(route && route.url !== history.location.pathname) {
            history.push(route.url, {
                state
            });
        }
    }

    static goBack(): void {
        if(!history.location.key || history.location.key === 'default') {
            Router.linkTo('index', {
                forceDirection: 'down',
            });
            return;
        }

        history.back();
    }

    onHistoryChanged(event: Update): void {
        const {action, location} = event;

        const {stateId, forceDirection} = (event.location.state as {state: LocationState|undefined})?.state || {
            stateId: undefined,
            forceDirection: undefined
        } as LocationState;
        const oldStateId = Router.currentStateId;

        if(action === 'REPLACE') {
            return;
        }

        // update the currentStateId
        if(stateId) {
            Router.currentStateId = stateId;
        }
        else {
            Router.currentStateId++;
            history.replace(location.pathname, {
                stateId: Router.currentStateId
            })
        }

        const newRoute = Router.getMatchingPathDefinition(event.location.pathname) || this.state.fallbackRoute;

        const transitionDirection = (action === 'PUSH' || oldStateId <= Router.currentStateId) ? 'up' : 'down';

        this.startWindowTransition(newRoute, forceDirection || transitionDirection);
    }

    startWindowTransition(newRoute: RouteDefinition, direction: 'up'|'down'): void {
        if(this.state.status !== 'idle') {
            this.historyChangedBuffer = {
                route: newRoute,
                direction: direction
            }
            return;
        }

        if(newRoute.id === this.state.currentRoute.id) {
            return; // we are already on this route
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