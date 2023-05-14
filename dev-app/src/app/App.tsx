import React, {Component} from 'react';
import Router from "./Router";
import HomeScreen from "./screens/homeScreen/HomeScreen";
import AboutMeScreen from "./screens/aboutmeScreen/AboutMeScreen";
import ShowcaseScreen from "./screens/showcaseScreen/ShowcaseScreen";
import NotFoundScreen from "./screens/notfoundScreen/NotFoundScreen";

export default class App extends Component<{}, {}> {

    render() {
        return (
            <div id="App" key={'default-app'}>
                <Router routes={[
                    {id: 'index', url: '/', component: <HomeScreen/>},
                    {id: '404', url: '/404', component: <NotFoundScreen/>},
                    {id: 'aboutme', url: '/aboutme', component: <AboutMeScreen/>},
                    {id: 'showcase', url: '/showcase', component: <ShowcaseScreen/>},
                ]}/>
            </div>
        );
    }

}

/*

            <header className="App-header">
                <p>
                    Comming soon...<FontAwesomeIcon icon={['far', "circle-question"]} />
                </p>
            </header>

 */
