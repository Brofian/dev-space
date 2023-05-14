import {Component} from "react";
import GoBackButton from "../../shared/elements/goBackButton/GoBackButton";

export default class ShowcaseScreen extends Component<{}, {}> {

    render() {
        return (
            <>
                <GoBackButton />

                <div className={'h2'}>
                    showcase
                </div>
            </>
        );
    }


}