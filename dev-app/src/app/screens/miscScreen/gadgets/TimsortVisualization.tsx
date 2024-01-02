import React, {Component} from "react";
import {P5CanvasInstance, ReactP5Wrapper} from "react-p5-wrapper";
import HighlandGothicFont from "../../../../resources/fonts/HighlandGothicFLF.ttf";

type InsertionData = {
    batchIndex: number;
    valueIndex: number;
    sortingIndex: number;
}

type MergeData = {
    batchA: number[];
    batchB: number[];
    mergeBatch: number[];
    batchAIndex: number;
    batchBIndex: number;
    mergeBatchIndex: number;
}

export default class TimsortVisualization extends Component<{}, {}> {

    // html element references
    statPhaseRef = React.createRef<HTMLTableCellElement>();
    statComparisonsRef = React.createRef<HTMLTableCellElement>();
    statInsertsRef = React.createRef<HTMLTableCellElement>();
    statMergesRef = React.createRef<HTMLTableCellElement>();

    // static variables
    numInserts: number = 0;
    numComparisons: number = 0;
    numMerges: number = 0;


    // sketch variables
    font: string = '';
    width: number = 1000;
    height: number = 400;
    lineWidth: number = 5;
    numElements: number = Math.floor(this.width / this.lineWidth);
    dataBatches: number[][] = [];
    frameRateRestriction: number = 60;
    finishAnimation: number = 0;


    // timsort variables
    phase: 'insertion'|'merge'|'finish' = 'insertion';
    // insertion variables
    insertionData: InsertionData = {
        batchIndex: 0,
        valueIndex: 1,
        sortingIndex: 1
    };
    // merge variables
    mergeData: MergeData = {
        batchA: [],
        batchB: [],
        mergeBatch: [],
        batchAIndex: -1,
        batchBIndex: -1,
        mergeBatchIndex: -1
    }

    constructor(props: {}) {
        super(props);

        try {
            this.width = document.body.getClientRects()[0].width - 40;

            // read properties from URL parameters
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            // line width
            if (urlParams.has('lw')) {
                const newLW = parseInt(urlParams.get('lw') || "5");
                this.lineWidth = Math.max(1, Math.min(newLW, 20));
            }
            // framerate
            if (urlParams.has('fr')) {
                const newFR = parseInt(urlParams.get('fr') || "60");
                this.frameRateRestriction = Math.max(1, Math.min(newFR, 120));
            }

            this.numElements = Math.floor(this.width / this.lineWidth);
        }
        catch (error) {/* ignore */}
    }


    preload(p5: P5CanvasInstance): void {
        this.font = p5.loadFont(HighlandGothicFont);
    }

    setup(p5: P5CanvasInstance): void {
        // setup sketch
        p5.createCanvas(this.width, this.height, p5.WEBGL);
        p5.textFont(this.font);
        p5.frameRate(this.frameRateRestriction);

        // generate data in batches of sqrt(n) elements
        const n = this.numElements;
        const k = Math.ceil(Math.sqrt(n));
        for (let i = 0; i < n/k; i++) {
            const batch: number[] = [];
            const from = i*k;
            const to = Math.min((i+1)*k, n);

            for (let a = from; a < to; a++) {
                const value = 1 + Math.floor(Math.random() * (this.height-1));
                batch.push(value);
            }

            this.dataBatches.push(batch);
        }
    }

    draw(p5: P5CanvasInstance): void {
        p5.background(50);
        p5.translate(-this.width/2, -this.height/2);

        switch (this.phase) {
            case "insertion":
                this.doInsertionStep();
                if (this.statInsertsRef.current && this.statComparisonsRef.current) {
                    this.statInsertsRef.current.innerText = this.numInserts.toString();
                    this.statComparisonsRef.current.innerText = this.numComparisons.toString();
                }
                break;
            case "merge":
                this.doMergeStep();
                if (this.statMergesRef.current && this.statComparisonsRef.current) {
                    this.statMergesRef.current.innerText = this.numMerges.toString();
                    this.statComparisonsRef.current.innerText = this.numComparisons.toString();
                }
                break;
            case "finish":
                if (this.finishAnimation > this.width) {
                    p5.noLoop();
                }
                p5.colorMode(p5.HSB);
                p5.background(20); // HSB
                this.finishAnimation += this.width / this.frameRateRestriction;
                break;
        }

        // draw data to screen
        let i: number = 1;
        p5.noStroke();
        for (let batchIndex = 0; batchIndex < this.dataBatches.length; batchIndex++) {
            for (let valueIndex = 0; valueIndex < this.dataBatches[batchIndex].length; valueIndex++) {
                p5.fill(...this.getColorByValue(batchIndex, valueIndex, i));
                p5.rect(i, 0, this.lineWidth, this.dataBatches[batchIndex][valueIndex]);
                i += this.lineWidth;
            }
        }

        // write info texts
        p5.stroke(200,0,0);
        p5.fill(250);
        p5.text(Math.floor(p5.frameRate())+" FPS", 15, 15);
    }

    getColorByValue(batchI: number, valueI: number, x: number): number[] {
        switch (this.phase) {
            case 'insertion':
                const {batchIndex, valueIndex, sortingIndex} = this.insertionData;

                if (batchI === batchIndex) {
                    if (valueI === valueIndex) {
                        return [200,0,0];
                    }
                    if (valueI === sortingIndex) {
                        return [0,250,0];
                    }
                    return [200];
                }
                break;
            case 'merge':
                const {batchAIndex, batchBIndex, mergeBatchIndex, mergeBatch} = this.mergeData;
                if (batchI === batchAIndex) {
                    if (valueI === 0) {
                        return [200,0,0];
                    }
                    return [150,100,100];
                }
                if (batchI === batchBIndex) {
                    if (valueI === 0) {
                        return [0,200,0];
                    }
                    return [100,150,100];
                }
                if (batchI === mergeBatchIndex) {
                    if (valueI === mergeBatch.length-1) {
                        return [200,200,0];
                    }
                    return [150,150,100];
                }
                break;
            case "finish":
                if (x > this.finishAnimation) {
                    return [60,20,49]; // HSB!
                }
                return [this.map(x, 0, this.width, 0, 360), 70, 70];
       }

        return [100];
    }

    map(value: number, valueMin: number, valueMax: number, targetMin: number, targetMax: number): number {
        const valueRange= valueMax - valueMin;
        const relativePosition = (value - valueMin) / valueRange;

        const targetRange = targetMax - targetMin;
        return (relativePosition * targetRange) + targetMin;
    }

    doInsertionStep(): void {
        const {batchIndex, valueIndex} = this.insertionData;

        const currentBatch: number[] = this.dataBatches[batchIndex];
        const currentValue = currentBatch[valueIndex];

        if (valueIndex > 0 && currentValue < currentBatch[valueIndex-1]) {
            // switch
            currentBatch[valueIndex] = currentBatch[valueIndex-1];
            currentBatch[valueIndex-1] = currentValue;
            this.insertionData.valueIndex--;

            this.numComparisons++;
        }
        else {
            // this value does not have to be inserted anymore, continue with the next value
            this.insertionData.sortingIndex++;
            this.insertionData.valueIndex = this.insertionData.sortingIndex;

            // check if this batch is finished
            if (this.insertionData.sortingIndex >= currentBatch.length) {
                this.insertionData.sortingIndex = 1;
                this.insertionData.valueIndex = 1;
                this.insertionData.batchIndex++;
            }

            // check insertion sort is finished for all batches
            if (this.insertionData.batchIndex >= this.dataBatches.length) {
                this.phase = 'merge';
                if (this.statPhaseRef.current) this.statPhaseRef.current.innerText = 'Merge-sort smallest groups';
            }

            this.numInserts++;
        }
    }

    doMergeStep(): void {
        let {batchA, batchB, mergeBatch} = this.mergeData;

        if (batchA.length === 0 && batchB.length === 0) {
            // remove all empty batches (should now be batchA and batchB)
            this.dataBatches = this.dataBatches.filter(batch => batch.length > 0);

            // check if we are finished
            if (this.dataBatches.length <= 1) {
                this.phase = 'finish';
                if (this.statPhaseRef.current) this.statPhaseRef.current.innerText = 'Finished';
                return;
            }

            // select smallest batches for next merge
            // TODO: implement this without predefined sorting
            const sortedBatches = [...this.dataBatches].sort((batch1, batch2) => batch1.length <= batch2.length ? -1 : 1);
            this.mergeData.batchA = batchA = sortedBatches[0];
            this.mergeData.batchB = batchB = sortedBatches[1];
            this.mergeData.batchAIndex = this.dataBatches.indexOf(batchA);
            this.mergeData.batchBIndex = this.dataBatches.indexOf(batchB);
            // create new merge target
            this.mergeData.mergeBatch = mergeBatch = [];
            const nextIndex = Math.max(this.mergeData.batchBIndex, this.mergeData.batchAIndex) + 1;
            this.dataBatches.splice(nextIndex, 0, mergeBatch);
            this.mergeData.mergeBatchIndex = nextIndex;
        }

        // continue comparison

        if (batchA.length === 0) {
            mergeBatch.push(batchB.shift() as number); // we can force this type, because there will always be a number left
        }
        else if (batchB.length === 0) {
            mergeBatch.push(batchA.shift() as number); // we can force this type, because there will always be a number left
        }
        else if (batchA[0] <= batchB[0]) {
            mergeBatch.push(batchA.shift() as number);
        }
        else {
            mergeBatch.push(batchB.shift() as number);
        }


        this.numComparisons++;
        this.numMerges++;
    }


    sketch(p5: P5CanvasInstance): void {
        p5.preload = this.preload.bind(this, p5);
        p5.setup = this.setup.bind(this, p5);
        p5.draw = this.draw.bind(this, p5);
    }

    render() {
        return (
            <div className={'timsort-visualization'}>

                <ReactP5Wrapper sketch={this.sketch.bind(this)}/>

                <div className={'infobox'}>
                    <div className={'description'}>
                        <h3>Timsort</h3>
                        <div>
                            Visualizing the timsort algorithm (a combination of insertionsort and mergesort).
                            <br/>
                            In preparation of the sorting, the array is divided into sqrt(n) equally sized batches (and
                            one
                            "rest"). These batches are then sorted one by one, using the insert-sort approach of
                            starting on the left, then
                            moving each <span className={'insertion-current'}>element</span> to the correct position to
                            the left of the <span className={'insertion-sorted'}>sorted
                        boundary</span> in the active batch by comparing it to its previous element.
                            <br/>
                            After all batches are sorted, the algorithm is switched to mergesort. Each step, the two
                            smallest batches are merged into one larger batch
                            by selecting the smallest element of the start of <span
                            className={'merge-batchA'}>batchA</span> and the start
                            of <span className={'merge-batchB'}>batchB</span>. This element is then moved to the <span
                            className={'merge-batch-combined'}>combined batch </span> (individual
                            elements appear highlighted).
                        </div>

                        <h3>How to use</h3>
                        <div>
                            The number of elements will be dynamically selected by the width of the window divided by
                            the thickness of one element.
                            <br/>
                            The thickness of each element can also be changed by setting the GET Parameter "lw".
                            For example:
                            <br/>
                            <a href={`?id=timsort&fr=${this.frameRateRestriction}&lw=1`}>1px per element</a>,
                            <a href={`?id=timsort&fr=${this.frameRateRestriction}&lw=5`}>5px per element (Default)</a> or
                            <a href={`?id=timsort&fr=${this.frameRateRestriction}&lw=15`}>15px per element</a>.
                            <br/>
                            You can also change the speed of the animation by restricting the maximum frames per second
                            with the GET Parameter "fr".
                            For example:
                            <br/>
                            <a href={`?id=timsort&fr=10&lw=${this.lineWidth}`}>10 FPS</a>,
                            <a href={`?id=timsort&fr=30&lw=${this.lineWidth}`}>30 FPS</a> or
                            <a href={`?id=timsort&fr=60&lw=${this.lineWidth}`}>60 FPS (Default)</a>.
                        </div>
                    </div>

                    <div className={'statistics'}>
                        <h3>Statistics:</h3>

                        <table>
                            <tbody>
                                <tr>
                                    <td>Elements</td>
                                    <td>{this.numElements} ({Math.ceil(Math.sqrt(this.numElements))} groups)</td>
                                </tr>
                                <tr>
                                    <td>Phase</td>
                                    <td ref={this.statPhaseRef}>Insertion-sort per group</td>
                                </tr>
                                <tr>
                                    <td>Comparisons</td>
                                    <td ref={this.statComparisonsRef}>0</td>
                                </tr>
                                <tr>
                                    <td>Insertions</td>
                                    <td ref={this.statInsertsRef}>0</td>
                                </tr>
                                <tr>
                                    <td>Merges</td>
                                    <td ref={this.statMergesRef}>0</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        );
    }
}