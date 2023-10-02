import {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import GadgetList from "./gadgets/GadgetList";
import StudyManager from "./gadgets/StudyManager";

export default class MiscScreen extends Component<{}, {}> {

    render() {
        const queryParameters = new URLSearchParams(window.location.search);
        const id = queryParameters.get("id") || 'list';
//                 <FontAwesomeIcon icon={['fas', 'code']} />

        return (
            <div className={'gadget-container'}>
                {this.renderGadget(id)}
             </div>
        );
    }

    renderGadget(gadgetId: string): JSX.Element {
        switch (gadgetId) {
            case "study-manager":
                return <StudyManager/>;
            case "list":
            default:
                return <GadgetList/>;
        }
    }
}