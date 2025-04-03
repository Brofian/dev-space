import React, {Component} from "react";
import localeStorage from "../../../utils/LocaleStorageAdapter";
import FixedCourseCell from "./StudyManager/FixedCourseCell";
import FreeCourseElement from "./StudyManager/FreeCourseElement";

type AvailableTags = 'none'|'inf'|'technisch'|'praktisch'|'theoretisch'|'proseminar';


export type Course = {
    id: string;
    title: string,
    ects: number,
    cleared?: boolean,
    allowInsert?: boolean,
    requiredTag?: AvailableTags,
    grade?: number;
};

export type FreeCourse = {
    title: string;
    ects: number;
    cleared: boolean;
    tags: AvailableTags[];
    assign: string|undefined;
    grade?: number;
};

type SaveData = {
    freeCourses: FreeCourse[];
    doneCourses: string[];
    grades?: {[key: string]: number};
}


interface IState {
    newCourseTitle: string;
    newCourseEcts: number;
    newCourseType: AvailableTags|string;
    avgGrade: number;
}


export default class StudyManager extends Component<{}, IState> {

    dropData: string = ""
    state = {
        newCourseTitle: '',
        newCourseEcts: 3,
        newCourseType: 'none',
        avgGrade: 0
    };

    layout: Course[][] = [
        [
            {id: 'M1',  title: 'Mathematik 1', ects: 9},
            {id: 'PI1', title: 'Praktische Informatik 1', ects: 9},
            {id: 'TI1', title: 'Technische Informatik 1', ects: 6},
            {id: 'ÜBK1', title: 'ÜbK', ects: 6, allowInsert: true}
        ],
        [
            {id: 'M2',  title: 'Mathematik 2', ects: 9},
            {id: 'PI2', title: 'Praktische Informatik 2', ects: 9},
            {id: 'TI2', title: 'Technische Informatik 2', ects: 9},
            {id: 'TI3', title: 'Technische Informatik 3', ects: 6},
        ],
        [
            {id: 'THI1',  title: 'Theoretische Informatik 1', ects: 9},
            {id: 'M3',    title: 'Mathematik 3', ects: 9},
            {id: 'PI3',   title: 'Praktische Informatik 3', ects: 6},
            {id: 'WPFTI', title: 'Wahlpflicht Techn. Inf.', ects: 6, allowInsert: true, requiredTag: 'technisch'},
        ],
        [
            {id: 'THI2', title: 'Theoretische Informatik 2', ects: 9},
            {id: 'M4',   title: 'Mathematik 4', ects: 6},
            {id: 'PI4',  title: 'Praktische Informatik 4', ects: 9},
            {id: 'GML',  title: 'Grundlagen d. Machinellen Lernens', ects: 6},
        ],
        [
            {id: 'PRO',    title: 'Proseminar', ects: 3, allowInsert: true, requiredTag: 'proseminar'},
            {id: 'WPFPI',  title: 'Wahlpflicht Prakt. Inf', ects: 6, allowInsert: true, requiredTag: 'praktisch'},
            {id: 'WPFTHI', title: 'Wahlpflicht Theo. Inf', ects: 6, allowInsert: true, requiredTag: 'theoretisch'},
            {id: 'ÜBK2',   title: 'ÜbK', ects: 6, allowInsert: true},
            {id: 'WPFINF1', title: 'Wahlpflicht Informatik', ects: 9, allowInsert: true, requiredTag: 'inf'},
        ],
        [
            {id: 'ÜBK3', title: 'ÜbK', ects: 6, allowInsert: true},
            {id: 'WPFINF2', title: 'Wahlpflicht Informatik', ects: 6, allowInsert: true, requiredTag: 'inf'},
            {id: 'BA', title: 'Bachelorarbeit', ects: 15},
        ],
    ];

    freeCourseList: FreeCourse[] = [];

    constructor(props: {}) {
        super(props);

        const storedData = localeStorage.get<SaveData>('study-manager-data');

        if(storedData) {
            // load course progress
            const courseProgress = storedData.doneCourses;
            const courseGrades = storedData.grades || {};
            for (const semester of this.layout) {
                for (const course of semester) {
                    if (courseProgress.includes(course.id)) {
                        course.cleared = true;
                    }
                    if (courseGrades[course.id]) {
                        course.grade = courseGrades[course.id];
                    }
                }
            }

            // load free course list
            this.freeCourseList = storedData.freeCourses;

            this.recalcGrades(false);
        }
    }

    save() {
        const doneCourses: string[] = [];
        const fixedCoursesGrades: {[key: string]: number} = {};
        for (const semester of this.layout) {
            for (const course of semester) {
                if (course.cleared) {
                    doneCourses.push(course.id);
                }
                if (course.grade) {
                    fixedCoursesGrades[course.id] = course.grade;
                }
            }
        }

        const data: SaveData = {
            freeCourses: this.freeCourseList,
            doneCourses: doneCourses,
            grades: fixedCoursesGrades,
        };
        localeStorage.set('study-manager-data', data);
    }

    recalcGrades(updateState: boolean = true) {
        let totalPoints = 0;
        let totalGrade = 0;
        for (const semester of this.layout) {
            for (const course of semester) {
                if (course.grade) {
                    totalPoints += course.ects;
                    totalGrade += course.grade * course.ects;

                }
            }
        }

        if (totalPoints === 0) {
            totalPoints = 1;
        }
        let averageGrade = totalGrade / totalPoints;
        if (updateState) {
            this.setState({
                avgGrade: averageGrade
            });
            this.save();
        }
        else {
            this.state.avgGrade = averageGrade;
        }
    }

    toggleClearOnClick(courseId: string, semesterIndex: number, event: React.MouseEvent<HTMLTableDataCellElement>): void {
        event.preventDefault();

        if (semesterIndex === -1) {
            // search in free courses and use courseId as index
            const indexFromId = parseInt(courseId);
            if (this.freeCourseList.length > indexFromId) {
                this.freeCourseList[indexFromId].cleared = !this.freeCourseList[indexFromId].cleared;
                this.save();
                this.setState({});
            }
            return;
        }


        for (const course of this.layout[semesterIndex]) {
            if (course.id === courseId) {
                course.cleared = !course.cleared;
                this.save();
                this.setState({});
                break;
            }
        }
    }

    onFreeCourseDragStart(fCourseIndex: number, event: React.DragEvent<HTMLTableDataCellElement>): void {
        this.dropData = ""+fCourseIndex;
        event.dataTransfer.setData('text', fCourseIndex+"");
    }

    onFreeCourseDraggedOver(container: Course, event: React.DragEvent<HTMLTableDataCellElement>): void {
        let fCourseIndex = event.dataTransfer.getData('text');
        fCourseIndex = (fCourseIndex === '') ? this.dropData : fCourseIndex;
        const fCourse = this.freeCourseList[parseInt(fCourseIndex)];

        const isAllowed = container.requiredTag === undefined || fCourse.tags.includes(container.requiredTag);
        if (isAllowed) {
            event.preventDefault();
        }
    }

    onFreeCourseDropped(container: Course, event: React.DragEvent<HTMLTableDataCellElement>): void {
        const fCourseIndex = event.dataTransfer.getData('text');
        const fCourse = this.freeCourseList[parseInt(fCourseIndex)];

        const isAllowed = container.requiredTag === undefined || fCourse.tags.includes(container.requiredTag);
        if (isAllowed) {
            event.preventDefault();
            fCourse.assign = (container.id === '') ? undefined : container.id;
            this.setState({});
            this.save();
        }
    }


    render() {

        const totalEctsPerSemester = this.layout.map(semesterCourses => {
            return semesterCourses.reduce((prev, course) => {
                return prev + course.ects;
            }, 0);
        });

        const maxEcts = totalEctsPerSemester.reduce((previousValue, ects) => Math.max(previousValue, ects), 0);

        // counts down, until the next course should be displayed in each column
        const ectsCounter = Array(this.layout.length).fill(0, 0, 0);
        const semesterCourseCounter = Array(this.layout.length).fill(0);
        const freeCourseSpaceCounter: {id: string, index: number, unusedEcts: number}[] = [];

        return (
            <div className={'study-manager'}>

                <table>
                    <thead>
                        <tr>
                            <th>1. Semester</th>
                            <th>2. Semester</th>
                            <th>3. Semester</th>
                            <th>4. Semester</th>
                            <th>5. Semester</th>
                            <th>6. Semester</th>
                        </tr>
                    </thead>

                    <tbody>

                    {Array(maxEcts).fill(1).map((_val, ectsIndex) => {
                        const cells = this.layout.map((semesterCourses, semesterIndex) => {
                            // if we are still inside a course, do nothing
                            if (ectsCounter[semesterIndex] > 0) {
                                ectsCounter[semesterIndex]--;
                                return undefined;
                            }

                            // if we have drawn all courses, do nothing
                            if (semesterCourseCounter[semesterIndex] >= semesterCourses.length) {
                                return <td key={'cell_' + ectsIndex + '_' + semesterIndex} className={'placeholder'}></td>;
                            }

                            // set counter to ignore the next x
                            const courseIndex = semesterCourseCounter[semesterIndex];
                            const course = semesterCourses[courseIndex];

                            if (!course.allowInsert) {
                                semesterCourseCounter[semesterIndex]++;
                                ectsCounter[semesterIndex] = course.ects - 1;

                                return <FixedCourseCell
                                    key={'cell_' + ectsIndex + '_' + semesterIndex}
                                    course={course}
                                    ectsIndex={ectsIndex}
                                    semesterIndex={semesterIndex}
                                    toggleClearOnClick={this.toggleClearOnClick.bind(this, course.id, semesterIndex)}
                                    recalcGrades={this.recalcGrades.bind(this)}
                                />;
                            }

                            const assignedFreeCourses = this.freeCourseList.filter(fCourse => fCourse.assign === course.id);
                            if (assignedFreeCourses.length === 0) {
                                semesterCourseCounter[semesterIndex]++;
                                ectsCounter[semesterIndex] = course.ects - 1;

                                return (
                                    <td key={'cell_' + ectsIndex + '_' + semesterIndex}
                                        rowSpan={course.ects}
                                        onDrop={this.onFreeCourseDropped.bind(this, course)}
                                        onDragOver={this.onFreeCourseDraggedOver.bind(this, course)}
                                    >
                                        {course.title} <br />
                                        ({course.ects} ECTS)
                                    </td>
                                );
                            }


                            let fCourseIndex = freeCourseSpaceCounter.findIndex(el => el.id === course.id);
                            if (fCourseIndex === -1) {
                                freeCourseSpaceCounter.push({id: course.id, index: 0, unusedEcts: course.ects});
                                fCourseIndex = freeCourseSpaceCounter.length - 1;
                            }

                            // case: we dont have enough free courses to fill the ects space
                            if (freeCourseSpaceCounter[fCourseIndex].index >= assignedFreeCourses.length) {
                                semesterCourseCounter[semesterIndex]++;
                                ectsCounter[semesterIndex] = freeCourseSpaceCounter[fCourseIndex].unusedEcts - 1;
                                return (
                                    <td key={'cell_' + ectsIndex + '_' + semesterIndex}
                                        rowSpan={freeCourseSpaceCounter[fCourseIndex].unusedEcts}
                                        onDrop={this.onFreeCourseDropped.bind(this, course)}
                                        onDragOver={this.onFreeCourseDraggedOver.bind(this, course)}
                                    >
                                        {course.title} <br />
                                        ({freeCourseSpaceCounter[fCourseIndex].unusedEcts} ECTS)
                                    </td>
                                );
                            }

                            const courseToRender = assignedFreeCourses[freeCourseSpaceCounter[fCourseIndex].index];
                            ectsCounter[semesterIndex] = courseToRender.ects - 1;
                            freeCourseSpaceCounter[fCourseIndex].unusedEcts -= courseToRender.ects;


                            freeCourseSpaceCounter[fCourseIndex].index++;
                            if (freeCourseSpaceCounter[fCourseIndex].index >= assignedFreeCourses.length &&
                                freeCourseSpaceCounter[fCourseIndex].unusedEcts <= 0
                            ) {
                                // we are out of free courses, continue with the next layout course
                                semesterCourseCounter[semesterIndex]++;
                            }

                            // render free course
                            const index = this.freeCourseList.findIndex(el => el === courseToRender);
                            return (
                                <td key={'cell_' + ectsIndex + '_' + semesterIndex}
                                    rowSpan={courseToRender.ects}
                                >
                                    <FreeCourseElement
                                        key={'free-course_' + index}
                                        course={courseToRender}
                                        index={index}
                                        deleteUnassignedFreeCourse={this.deleteUnassignedFreeCourse.bind(this, index)}
                                        onFreeCourseDragStart={this.onFreeCourseDragStart.bind(this, index)}
                                        getLabelFromTag={this.getLabelFromTag.bind(this, courseToRender.tags)}
                                        toggleClearOnClick={this.toggleClearOnClick.bind(this, index.toString(), -1)}
                                        recalcGrades={this.recalcGrades.bind(this)}
                                    />
                                </td>
                            );
                        });

                        return <tr key={'row_' + ectsIndex}>
                            {cells.map(cell => cell)}
                        </tr>;}
                    )}
                    </tbody>

                    <tfoot>
                        {this.renderTableFooter()}
                    </tfoot>
                </table>


                {this.renderUnassignedFreeCourses()}

            </div>
        );
    }

    renderTableFooter(): JSX.Element {
        const ectsSums: {sum: number, achieved: number}[] = [];
        let totalSum = 0;
        let totalAchieved = 0;

        for (const semesterCourses of this.layout) {
            const semester = {
                sum: 0,
                achieved: 0
            };
            for (const course of semesterCourses) {
                semester.sum += course.ects;

                if(!course.allowInsert && course.cleared) {
                    semester.achieved += course.ects;
                }
                else if(course.allowInsert) {
                    for(const fCourse of this.freeCourseList) {
                        if (fCourse.assign === course.id && fCourse.cleared) {
                            semester.achieved += fCourse.ects;
                        }
                    }
                }
            }
            ectsSums.push(semester);
            totalSum += semester.sum;
            totalAchieved += semester.achieved;
        }

        return (
            <>
                <tr>
                    {ectsSums.map((data, index) => <td key={index}>
                        {data.achieved} / {data.sum}
                    </td>)}
                </tr>
                <tr>
                   <td colSpan={ectsSums.length}>
                       Gesamt: {totalAchieved} / {totalSum}
                       <span style={{
                           display: 'inline-block',
                           minWidth: '4rem',
                       }}></span>
                       Noten-Durchschnitt: {this.state.avgGrade ? this.state.avgGrade.toPrecision(3) : '<no data>'}
                   </td>
                </tr>
            </>
        );
    }

    renderUnassignedFreeCourses(): JSX.Element {
        const tempCourse: Course = {
            id: '',
            allowInsert: true,
            title: '',
            ects: 0,
            cleared: false,
            requiredTag: undefined
        };

        return (
            <div className={'free-course-list'}
                 onDragOver={this.onFreeCourseDraggedOver.bind(this, tempCourse)}
                 onDrop={this.onFreeCourseDropped.bind(this, tempCourse)}
            >
                {this.freeCourseList.map((freeCourse, index) => {
                    if(freeCourse.assign === undefined) {
                        return (
                            <FreeCourseElement
                                key={'free-course_' + index}
                                course={freeCourse}
                                index={index}
                                deleteUnassignedFreeCourse={this.deleteUnassignedFreeCourse.bind(this, index)}
                                onFreeCourseDragStart={this.onFreeCourseDragStart.bind(this, index)}
                                getLabelFromTag={this.getLabelFromTag.bind(this, freeCourse.tags)}
                                toggleClearOnClick={this.toggleClearOnClick.bind(this, index.toString(), -1)}
                                recalcGrades={this.recalcGrades.bind(this)}
                            />
                        );
                    }
                    return undefined;
                })}

                <div className={'free-course create-new-course'}>
                    <input type={'text'} placeholder={'Titel'} value={this.state.newCourseTitle} onChange={(event) => {
                        this.setState({newCourseTitle: event.target.value});
                    }} />
                    <label>
                        <input type={'number'} value={this.state.newCourseEcts} min={1} max={15} onChange={(event) => {
                            this.setState({newCourseEcts: parseInt(event.target.value)});
                        }} /> ECTS
                    </label>
                    <select onChange={(event) => this.setState({newCourseType: event.target.value as AvailableTags})}>
                        <option value={'none'}>Allgemein</option>
                        <option value={'inf'}>Allgemeine Informatik</option>
                        <option value={'praktisch'}>Praktische Informatik</option>
                        <option value={'technisch'}>Technische Informatik</option>
                        <option value={'theoretisch'}>Theoretische Informatik</option>
                        <option value={'proseminar'}>Proseminar</option>
                    </select>
                    <button onClick={this.createNewCourse.bind(this)}>Erstellen</button>
                </div>

            </div>
        );
    }

    createNewCourse(): void {
        if (this.state.newCourseTitle === '') {
            return;
        }

        let tags: AvailableTags[] = [this.state.newCourseType as AvailableTags];
        switch (this.state.newCourseType) {
            case 'technisch':
            case 'praktisch':
            case 'theoretisch':
                tags.push('inf');
                break;
        }

        this.freeCourseList.push({
            title: this.state.newCourseTitle,
            ects: this.state.newCourseEcts,
            assign: undefined,
            cleared: false,
            tags: tags,
        });
        this.setState({
            newCourseEcts: 3,
            newCourseTitle: ''
        });
        this.save();
    }

    deleteUnassignedFreeCourse(index: number) {
        this.freeCourseList.splice(index, 1);
        this.setState({});
        this.save();
    }

    getLabelFromTag(tags: string[]): string {
        if (tags.includes('technisch')) {
            return 'Tech Inf';
        }
        if (tags.includes('praktisch')) {
            return 'Prak Inf';
        }
        if (tags.includes('theoretisch')) {
            return 'Theo Inf';
        }
        if (tags.includes('proseminar')) {
            return 'Proseminar';
        }
        if (tags.includes('inf')) {
            return 'Allg Inf';
        }

        return 'Allgemein';
    }

}
