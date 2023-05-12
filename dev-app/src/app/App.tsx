import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Router from "./Router";

function App() {

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Comming soon...<FontAwesomeIcon icon={['far', "circle-question"]} />
                </p>

                <div onClick={() => Router.linkTo('/')}>back to start</div>
                <div onClick={() => Router.linkTo('/home')}>go home</div>
                <div onClick={() => Router.linkTo('/there')}>go there</div>
            </header>

            <Router routes={[
                {url: '/', component: <span>helloworld</span>}
            ]}/>
        </div>
    );
}

export default App;
