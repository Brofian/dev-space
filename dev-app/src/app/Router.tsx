import React, {JSX} from "react";
import history from "history/browser";

type RouteList = RouteDefinition[];

type RouteDefinition = {
    url: string,
    component: JSX.Element
}

interface IState {
    prevRoute: RouteDefinition|undefined,
    currentRoute: RouteDefinition,
    nextRoute: RouteDefinition|undefined
}

interface IProps {
    routes: RouteList
}

export default class Router extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        const initialRoute = this.getMatchingRouteDefinition('/');
        if(!initialRoute) {
            throw new Error('No initial route found!');
        }

        this.state = {
            prevRoute: undefined,
            currentRoute: initialRoute,
            nextRoute: undefined
        }

        history.listen(this.onHistoryChanged.bind(this));
    }

    getMatchingRouteDefinition(path: string): RouteDefinition|undefined {
        return this.props.routes.find((route) => {
            return route.url === path;
        });
    }

    static linkTo(path: string, state: any = undefined): void {
        history.push(path, state);
    }

    onHistoryChanged(): void {
        const newLocation = history.location;
        const newAction = history.action; // PUSH for new entries, POP for moving in the history

        console.log(`now at ${newLocation.pathname} : ${newAction} with`, newLocation.state);
    }


    render() {
        return (
            <>
                <p>helloworld</p>
            </>
        );
    }


}