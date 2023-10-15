import {Component} from "react";
import GadgetList from "./gadgets/GadgetList";
import StudyManager from "./gadgets/StudyManager";
import FlowChart from "./gadgets/FlowChart";

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
            case "flow-chart":
                return <FlowChart/>;
            case "list":
            default:
                return <GadgetList/>;
        }
    }
}