import {Component} from "react";
import Router from "../../Router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class HomeScreen extends Component<{}, {}> {

    render() {
        return (
            <>

                <div className={'h1'}>Fabian Holzwarth</div>

                <div className={'attributes'}>
                    Computer Scientist
                    <span className={'separator'}>|</span>
                    Web-Developer
                    <span className={'separator'}>|</span>
                    Cookie Enthusiast
                </div>

                <div className={'c2a-buttons content-stretched'}>
                    <button onClick={() => Router.linkTo('aboutme')}>
                        About me
                        <FontAwesomeIcon icon={['fas', 'user']} />
                    </button>

                    <button onClick={() => Router.linkTo('showcase')}>
                        Showcase
                        <FontAwesomeIcon icon={['fas', 'code']} />
                    </button>
                </div>
            </>
        );
    }


}