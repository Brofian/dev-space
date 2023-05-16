import {Component} from "react";
import Router from "../../Router";
import UniverseImage from "../../../resources/images/universe.jpg"

export default class NotFoundScreen extends Component<{}, {}> {

    render() {
        return (
            <div className={'content-center full-size'} style={{
                backgroundImage: `url('${UniverseImage}')`
            }}>

                <div className={'glass-pane'}>

                    <div
                        className={'h1 space-text'}
                        style={{
                            backgroundImage: `url('${UniverseImage}')`
                        }}
                    >
                        Now entering outer space!
                    </div>

                    <div className={'message'}>
                        Seems like this <span className={'striked'}>planet</span> page does not exist. Check the URL or return to the homepage
                    </div>

                    <button onClick={() => Router.goBack()}>Let's go back</button>

                </div>

            </div>
        );
    }


}