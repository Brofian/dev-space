import {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Router from "../../../Router";

export default class GoBackButton extends Component<{}, {}> {

    render() {
        return (
            <button className={'go-back-button'} onClick={() => Router.goBack()}>
                <FontAwesomeIcon icon={['fas', 'chevron-up']} />
                <span>Go back</span>
            </button>
        );
    }

}