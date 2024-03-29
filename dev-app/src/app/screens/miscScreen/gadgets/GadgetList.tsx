import {Component} from "react";

export default class GadgetList extends Component<{}, {}> {


    render() {
        const urlData =  new URL(window.location + '');
        const baseUrl = urlData.origin + urlData.pathname + '?id=';

        return (
            <div className={'gadget-list'}>

                <ul>
                    <a href={baseUrl + 'study-manager'}>
                        <li>Studienplaner / Study-Manager</li>
                    </a>

                    <a href={baseUrl + 'flow-chart'}>
                        <li>Ablaufplaner / Flow-Chart</li>
                    </a>

                    <a href={baseUrl + 'timsort'}>
                        <li>Timsort Visualisierung</li>
                    </a>

                    <a href={baseUrl + 'listme-app'}>
                        <li>Listme App</li>
                    </a>
                </ul>

            </div>
        );
    }


}