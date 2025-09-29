import {Component} from "react";
import GadgetList from "./gadgets/GadgetList";
import StudyManager from "./gadgets/StudyManager";
import FlowChart from "./gadgets/FlowChart";
import TimsortVisualization from "./gadgets/TimsortVisualization";
import ListmeApp from "./gadgets/ListmeApp";
import StudyManagerMaster from "./gadgets/StudyManagerMaster";

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
            case "study-manager-master":
                return <StudyManagerMaster />;
            case "study-manager":
                return <StudyManager/>;
            case "flow-chart":
                return <FlowChart/>;
            case "timsort":
                return <TimsortVisualization/>;
            case "listme-app":
                return <ListmeApp/>;
            case "list":
            default:
                return <GadgetList/>;
        }
    }
}