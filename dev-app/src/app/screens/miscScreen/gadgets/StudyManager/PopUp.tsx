import {Component, ReactElement} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface IProps {
    children: ReactElement|ReactElement[];
    isOpen: boolean;
    onClose: {(): void};
}

export default class PopUp extends Component<IProps, {}> {


    render() {
        return (
            <div className={`popup-backdrop ${this.props.isOpen ? 'popup-open' : 'popup-hidden'}`}>
                <div className={'popup'}>
                    {this.props.children}

                    <span
                        className={'popup-toggle'}
                        onClick={this.props.onClose}
                    >
                        <i className={'fac-icon'}>
                            <FontAwesomeIcon icon={['fas', 'x']} />
                        </i>
                    </span>
                </div>
            </div>
        );
    }
}