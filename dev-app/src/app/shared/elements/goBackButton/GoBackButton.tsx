import {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import history from "history/browser";

export default class GoBackButton extends Component<{}, {}> {

    render() {
        if(!history.location.key) {
            return <></>;
        }

        return (
            <button className={'go-back-button'} onClick={() => history.back()}>
                <FontAwesomeIcon icon={['fas', 'chevron-up']} />
                <span>Go back</span>
            </button>
        );
    }

}