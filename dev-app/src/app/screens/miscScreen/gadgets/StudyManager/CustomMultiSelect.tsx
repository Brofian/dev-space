import {Component, createRef} from "react";

type SelectOption<T> = {
    value: T;
    label: string;
    tagLabel: string;
    selected: boolean;
}

interface IProps<T> {
    options: SelectOption<T>[];
    onSelectionChanged: {(newSelection: T[]): void};
}

interface IState {
    showSelectionWindow: boolean;
}

export default class CustomMultiSelect<T> extends Component<IProps<T>, IState> {

    state: IState = {
        showSelectionWindow: false
    }

    bodyListener: {(event: MouseEvent): void} = this.onBodyClicked.bind(this);
    elementRef = createRef<HTMLDivElement>();

    componentDidMount() {
        document.body.addEventListener('click', this.bodyListener);
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.bodyListener);
    }

    onBodyClicked(event: MouseEvent) {
        this.setState({
            showSelectionWindow: false
        });
    }

    onOptionClicked(option: SelectOption<T>) {
        option.selected = !option.selected;
        const selection = this.props.options.filter(o => o.selected);
        this.props.onSelectionChanged(selection.map(s => s.value));
    }

    render() {
        return (
            <div className={'custom-multi-select'} ref={this.elementRef} onClick={e => e.stopPropagation()}>
                {/* Render all selected elements */}
                {this.props.options.filter(o => o.selected).map(option =>
                    <div className={'multi-select-element'}
                        onClick={this.onOptionClicked.bind(this, option)}
                    >{option.tagLabel}</div>
                )}

                {/* Render space to add a new element as a toggle */}
                <div className={'multi-select-add'}
                    onClick={() => this.setState({showSelectionWindow: true})}
                >...</div>

                {/* Conditionally render element list for toggling */}
                {this.state.showSelectionWindow &&
                    <div className={'multi-select-options'}>
                        {this.props.options.map(option =>
                            <div className={'multi-select-option'}
                                onClick={this.onOptionClicked.bind(this, option)}
                            >
                                <span>{option.label}</span>
                                <span>{option.selected ? 'OK' : ''}</span>
                            </div>
                        )}
                    </div>
                }


            </div>
        );
    }
}