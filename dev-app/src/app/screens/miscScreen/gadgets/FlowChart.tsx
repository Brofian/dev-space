import React, {Component, createRef} from "react";
import localeStorage from "../../../utils/LocaleStorageAdapter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationCrosshairs, faTrash} from "@fortawesome/free-solid-svg-icons";

type Vector = {
    x: number;
    y: number;
}


type ChartNode = {
    id: string;
    title: string;
    description?: string;
    position: Vector;
    previousNodes: string[];
    done: boolean;
}

type Chart = {
    id: string;
    title: string;
    nodes: ChartNode[];
};

type SaveData = Chart[];

type NodeConnection = {
    start: Vector;
    end: Vector;
    startNodeId: string;
    endNodeId: string;
}

interface IState {
    currentChartId?: string;
    newChartTitle: string;
    contentDimensions: Vector;
    contentOffset: Vector;
    zoomFactor: number;
    draggedNode?: ChartNode;
    currentConnectionStartNode?: ChartNode;
}


export default class FlowChart extends Component<{}, IState> {

    chartList: Chart[] = [];
    windowResizeListener?: {(): void};
    contentPanelRef = createRef<HTMLDivElement>();

    nodeDraggedStart: Vector|undefined = undefined;
    panelDraggedStart: Vector|undefined = undefined;
    isDraggingPanel: boolean = false;

    state: IState = {
        currentChartId: undefined,
        newChartTitle: '',
        contentDimensions: {x: 1, y: 1},
        contentOffset: {x: 0, y: 0},
        zoomFactor: 1,
        draggedNode: undefined,
        currentConnectionStartNode: undefined
    };

    constructor(props: {}) {
        super(props);

        const storedData = localeStorage.get<SaveData>('flow-chart-data');
        if(storedData) {
            this.chartList = storedData;
            if (this.chartList.length > 0) {
                this.state.currentChartId = this.chartList[0].id;
            }
        }
    }

    componentDidMount() {
        if (!this.windowResizeListener) {
            this.windowResizeListener = this.updateContentDimensions.bind(this);
            window.addEventListener('resize', this.windowResizeListener);
        }
        this.updateContentDimensions();
    }

    componentWillUnmount() {
        if (this.windowResizeListener) {
            window.removeEventListener('resize', this.windowResizeListener);
            this.windowResizeListener = undefined;
        }
    }

    updateContentDimensions() {
        const currentPanel = this.contentPanelRef.current;
        if(!currentPanel) {
            return;
        }

        const bounds = currentPanel.getBoundingClientRect();

        this.setState({
           contentDimensions: {
               x: bounds.width,
               y: bounds.height
           }
        });
    }

    save() {
        localeStorage.set('flow-chart-data', this.chartList);
    }

    generateId(): string {
        return Math.floor(Math.random() * 1000000000) + '';
    }

    createNewChart(): void {
        if(this.state.newChartTitle.length < 3) {
            return;
        }

        const newChart: Chart = {
            id: this.generateId(),
            title: this.state.newChartTitle,
            nodes: []
        };
        this.chartList.push(newChart);

        this.save();
        this.setState({
            newChartTitle: '',
        });
        this.openChart(newChart.id);
    }

    openChart(chartId: string): void {
        this.setState({
            currentChartId: chartId,
            zoomFactor: 1.0,
            contentOffset: {x: 0, y: 0},
            draggedNode: undefined,
            currentConnectionStartNode: undefined
        })
    }


    deleteCurrentChart(): void {
        if (!this.state.currentChartId) {
            return;
        }

        if(!window.confirm('Do you really want to delete the current chart? (Forever!)')) {
            return;
        }

        this.chartList = this.chartList.filter((chart) => chart.id !== this.state.currentChartId);
        this.save();
        this.setState({
            currentChartId: (this.chartList.length > 0) ? this.chartList[0].id : undefined
        });
    }

    createNode(): void {
        if (!this.state.currentChartId) {
            return;
        }

        const currentChart = this.chartList.find((chart) => chart.id === this.state.currentChartId);
        if (!currentChart) {
            return;
        }

        const newNode: ChartNode = {
            id: this.generateId(),
            title: 'Leeres Element',
            description: undefined,
            previousNodes: [],
            done: false,
            position: {
                x: -this.state.contentOffset.x,
                y: -this.state.contentOffset.y
            }
        };
        currentChart.nodes.push(newNode);

        this.save();
        this.setState({});
    }


    render() {

        return (
            <div className={'flow-chart'}>

                <div className={'action-panel'}>

                    <div className={'change-chart'}>
                        <select onChange={(event) => this.openChart(event.currentTarget.value)}
                                value={this.state.currentChartId}
                                className={'change-chart-select'}
                        >
                            {this.chartList.map((chart, index) =>
                                <option key={index}
                                        value={chart.id}>
                                    {chart.title}
                                </option>
                            )}

                            {this.chartList.length <= 0 && <option>Keine Listen definiert</option>}
                        </select>
                    </div>

                    <div className={'create-new-chart'}>
                        <input type={'text'}
                               placeholder={'Titel'}
                               value={this.state.newChartTitle}
                               onChange={(event) => this.setState({newChartTitle: event.target.value})}>
                        </input>
                        <button onClick={this.createNewChart.bind(this)}>
                            Erstellen
                        </button>
                    </div>

                    <div className={'chart-options'}>

                        {this.state.currentChartId &&
                            <>
                                <button onClick={this.createNode.bind(this)}
                                        className={'create-node-button'}>
                                    Element erstellen
                                </button>

                                <button onClick={this.deleteCurrentChart.bind(this)}
                                        className={'delete-chart-button'}>
                                    Ablaufplan löschen
                                </button>
                            </>
                        }

                    </div>
                </div>

                <div className={'content-panel'}
                     ref={this.contentPanelRef}
                     onDragOver={(event) => event.preventDefault()}
                     onMouseMove={this.onContentPanelDrag.bind(this)}
                     onMouseDown={() => this.isDraggingPanel = true}
                     onMouseUp={this.onContentPanelDragEnd.bind(this)}
                     onMouseLeave={this.onContentPanelDragEnd.bind(this)}
                     onWheel={this.onContentPanelZoom.bind(this)}
                >
                    <div className={'delete-node-field'}
                         onDragOver={(event) => event.preventDefault()}
                         onDrop={this.onNodeDropDelete.bind(this)}
                         style={{
                             right: this.state.draggedNode ? '3rem' : '-10rem',
                         }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </div>

                    <div className={'reset-offset-field'}
                         onClick={() => this.setState({
                             contentOffset: {x: 0, y: 0}
                         })}
                    >
                        <FontAwesomeIcon icon={faLocationCrosshairs} size={'2xl'} />
                    </div>

                    {this.state.currentChartId && this.renderChartNodeConnections()}

                    {this.state.currentChartId && this.renderChartNodes()}
                </div>

            </div>
        );
    }


    onNodeDragStart(node: ChartNode, event: React.DragEvent<HTMLDivElement>): void {
        this.nodeDraggedStart = {
            x: event.clientX,
            y: event.clientY,
        };

        console.log("Start: " + event.clientX + "|" + event.clientY);

        this.setState({
            draggedNode: node
        });
    }

    onNodeDragEnd(node: ChartNode, event: React.DragEvent<HTMLDivElement>): void {
        if (this.nodeDraggedStart) {

            const screenData = (window.screen || {}) as any;
            const xOffset = (screenData.availLeft ? screenData.availLeft : 0);
            const yOffset = (screenData.availTop ? screenData.availTop : 0);

            const relativeMovement: Vector = {
                x: event.clientX - this.nodeDraggedStart.x - xOffset,
                y: event.clientY - this.nodeDraggedStart.y - yOffset,
            }

            console.log("End: " + (event.clientX - xOffset) + "|" + (event.clientY - yOffset));

            node.position.x += relativeMovement.x;
            node.position.y += relativeMovement.y;
        }

        this.setState({
            draggedNode: undefined
        });
        this.save();
    }

    onNodeDropDelete(): void {
        const currentChart = this.chartList.find(chart => chart.id === this.state.currentChartId);
        if (!currentChart) {
            return;
        }

        currentChart.nodes = currentChart.nodes.filter(node => node !== this.state.draggedNode);
        for (const chartNode of currentChart.nodes) {
            chartNode.previousNodes.filter(prevNodeId => prevNodeId !== this.state.draggedNode?.id);
        }

        // in most browsers, save will be called again after dropEnd event. But this is to ensure to always save the changes
        this.save();
    }

    onContentPanelDrag(event: React.DragEvent<HTMLDivElement>): void {
        if (!this.isDraggingPanel || this.state.draggedNode) {
            return;
        }

        const newDragPosition: Vector = {
            x: event.clientX,
            y: event.clientY,
        };

        if (!this.panelDraggedStart) {
            this.panelDraggedStart = newDragPosition;
            return;
        }

        const relativeMotion: Vector = {
            x: newDragPosition.x - this.panelDraggedStart.x,
            y: newDragPosition.y - this.panelDraggedStart.y
        }

        if (relativeMotion.x < 1 && relativeMotion.y < 1 && relativeMotion.x > -1 && relativeMotion.x > -1) {
            return;
        }

        this.setState({
           contentOffset: {
                x: this.state.contentOffset.x + relativeMotion.x,
                y: this.state.contentOffset.y + relativeMotion.y,
           }
        });

        this.panelDraggedStart = newDragPosition;
    }

    onContentPanelDragEnd(): void {
        this.isDraggingPanel = false;
        this.panelDraggedStart = undefined;
    }

    onContentPanelZoom(event: React.WheelEvent<HTMLDivElement>): void {
        this.setState({
            zoomFactor: this.state.zoomFactor - (event.deltaY / 1000)
        });
        event.preventDefault();
        event.stopPropagation();
    }

    onNodeTitleChanged(node: ChartNode, event: React.FocusEvent<HTMLDivElement>): void {
        node.title = event.currentTarget.innerHTML;
        this.save();
    }

    onNodeDescriptionChanged(node: ChartNode, event: React.FocusEvent<HTMLDivElement>): void {
        node.description = event.currentTarget.innerHTML;
        this.save();
    }

    renderChartNodes(): JSX.Element {
        const currentChart = this.chartList.find(chart => chart.id === this.state.currentChartId);
        if(!currentChart) {
            return <></>;
        }

        const contentCenter: Vector = {
            x: this.state.contentDimensions.x / 2 + this.state.contentOffset.x,
            y: this.state.contentDimensions.y / 2 + this.state.contentOffset.y,
        };

        return <>
            {currentChart.nodes.map((chartNode, index) => {

                const classes = ['chart-node'];
                if (chartNode === this.state.currentConnectionStartNode) {
                    classes.push('is-connection-start');
                }

                return (
                    <div className={classes.join(' ')}
                         key={index}
                         style={{
                             left: contentCenter.x + (chartNode.position.x * this.state.zoomFactor),
                             top: contentCenter.y + (chartNode.position.y * this.state.zoomFactor),
                             transform: `translate(-50%,-50%) scale(${this.state.zoomFactor})`,
                             opacity: (chartNode === this.state.draggedNode) ? 0.5 : 1,
                         }}
                         onMouseDown={(event) => event.stopPropagation()}
                         onContextMenu={this.onNodeConnection.bind(this, chartNode)}
                         onDragStart={this.onNodeDragStart.bind(this, chartNode)}
                         onDragEnd={this.onNodeDragEnd.bind(this, chartNode)}
                         draggable={true}
                    >
                        <div className={'chart-node-title'}
                             contentEditable={true}
                             onBlur={this.onNodeTitleChanged.bind(this, chartNode)}
                             dangerouslySetInnerHTML={{__html: chartNode.title}}
                        >
                        </div>


                        <div className={'chart-node-description'}
                             contentEditable={true}
                             onBlur={this.onNodeDescriptionChanged.bind(this, chartNode)}
                             dangerouslySetInnerHTML={{__html: chartNode.description||''}}
                        >
                        </div>

                    </div>
                );
            })}
        </>;
    }

    onNodeConnection(node: ChartNode, event: React.MouseEvent<HTMLDivElement>): void {
        const startNode = this.state.currentConnectionStartNode;
        event.preventDefault();

        if(startNode === undefined) {
            this.setState({
               currentConnectionStartNode: node
            });
        }
        else {
            const connectionAlreadyExists = node.previousNodes.includes(startNode.id);
            const reverseAlreadyExists = startNode.previousNodes.includes(node.id);
            const isIdenticalNode = node.id === startNode.id;

            if (!connectionAlreadyExists && !reverseAlreadyExists && !isIdenticalNode) {
                node.previousNodes.push(startNode.id);
            }

            this.setState({
                currentConnectionStartNode: undefined
            })
        }
    }

    deleteNodeConnection(ownerNodeId: string, prevNodeId: string, event: React.MouseEvent<HTMLDivElement>): void {
        event.preventDefault();

        const currentChart = this.chartList.find(chart => chart.id === this.state.currentChartId);
        if(!currentChart) {
            return;
        }

        const ownerNode = currentChart.nodes.find(node => node.id === ownerNodeId);
        if(!ownerNode) {
            return;
        }

        ownerNode.previousNodes = ownerNode.previousNodes.filter(nodeId => nodeId !== prevNodeId);

        this.setState({});
        this.save();
    }


    renderChartNodeConnections(): JSX.Element {
        const currentChart = this.chartList.find(chart => chart.id === this.state.currentChartId);
        if(!currentChart) {
            return <></>;
        }

        const contentCenter: Vector = {
            x: this.state.contentDimensions.x / 2 + this.state.contentOffset.x,
            y: this.state.contentDimensions.y / 2 + this.state.contentOffset.y,
        };

        const connections: NodeConnection[] = [];

        for(const chartNode of currentChart.nodes) {
            for(const prevNodeId of chartNode.previousNodes) {
                const prevNode = currentChart.nodes.find(node => node.id === prevNodeId);
                if (prevNode) {
                    const startPoint: Vector = {
                        x: contentCenter.x + (prevNode.position.x * this.state.zoomFactor),
                        y: contentCenter.y + (prevNode.position.y * this.state.zoomFactor),
                    };
                    const endPoint: Vector = {
                        x: contentCenter.x + (chartNode.position.x * this.state.zoomFactor),
                        y: contentCenter.y + (chartNode.position.y * this.state.zoomFactor),
                    };


                    connections.push({
                        start: startPoint,
                        end: endPoint,
                        startNodeId: prevNode.id,
                        endNodeId: chartNode.id
                    });
                }
            }
        }

        const PI_RAD = 180 / Math.PI;

        return (
            <>
                {connections.map((conn, index) => {
                    const {start,end} = conn;

                    const length = Math.sqrt(
                        ( (end.x - start.x) * (end.x - start.x) ) + ( (end.y - start.y) * (end.y - start.y) )
                    );

                    const center: Vector = {
                        x: (end.x + start.x) / 2 - (length/2),
                        y: (end.y + start.y) / 2 - 1.5,
                    };

                    const angle = Math.atan2((start.y - end.y), (start.x - end.x)) * PI_RAD;

                    return (
                        <div
                            className={'chart-node-connection'}
                            style={{
                                height: '3px',
                                width: length+'px',
                                top: center.y,
                                left: center.x,
                                transform: `rotate(${angle}deg)`
                            }}
                            key={index}
                            onClick={this.deleteNodeConnection.bind(this, conn.endNodeId, conn.startNodeId)}
                        ></div>
                    );
                })}
            </>
        );
    }




}