import React, {Component, ReactElement} from "react";
import localeStorage from "../../../utils/LocaleStorageAdapter";
import CustomMultiSelect from "./StudyManager/CustomMultiSelect";
import PopUp from "./StudyManager/PopUp";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const availableTagList = ['INFO-PRAK', 'INFO-TECH', 'INFO-THEO', 'INFO-INFO', 'INFO-FOKUS', 'INFO-BASIS', 'MASTER-THESIS'] as const;
type AvailableTags = typeof availableTagList[number];
const availableTagTranslation: { [key in AvailableTags]: string } = {
    "INFO-BASIS": "BASIS", // Nicht relevant für mich, nur falls nachgeholt werden muss
    "INFO-FOKUS": "FOKUS",
    "INFO-INFO": "INFO", // Forschungsprojekt zählt zu INFO-INFO, ebenso wie Bachelor Vorlesungen
    "INFO-PRAK": "PRAK",
    "INFO-TECH": "TECH",
    "INFO-THEO": "THEO",
    "MASTER-THESIS": "THESIS",
}

export type Course = {
    id: string;
    title: string,
    ects: number,
    cleared?: boolean,
    allowInsert?: boolean,
    tags: AvailableTags[],
    selectedTag: AvailableTags,
    grade?: number;
    gradeString?: string;
};

type CourseLayout = {
    s1: Course[],
    s2: Course[],
    s3: Course[],
    s4: [] | [Course],
}

type SaveData = {
    assignedCourses: CourseLayout;
    availableCourses: Course[];
}


interface IState {
    newCourseTitle: string;
    newCourseEcts: number;
    newCourseTypes: AvailableTags[];
    avgGrade: number;
    showInfoPopup: boolean;
}


export default class StudyManager extends Component<{}, IState> {

    dropData: string = ""
    state = {
        newCourseTitle: '',
        newCourseEcts: 3,
        newCourseTypes: ['none' as AvailableTags],
        avgGrade: 0,
        showInfoPopup: false
    };

    assignedCourses: CourseLayout = {
        s1: [],
        s2: [],
        s3: [],
        s4: [],
    };
    availableCourses: Course[] = [];

    constructor(props: {}) {
        super(props);

        const storedData = localeStorage.get<SaveData>('study-manager-data-master');
        if (storedData) {
            // load course progress
            this.availableCourses = storedData.availableCourses;
            this.assignedCourses = storedData.assignedCourses;
            this.recalcGrades(false);
        }
    }

    save() {
        const data: SaveData = {
            assignedCourses: this.assignedCourses,
            availableCourses: this.availableCourses,
        };
        localeStorage.set('study-manager-data-master', data);
    }

    recalcGrades(updateState: boolean = true) {
        let totalPoints = 0;
        let totalGrade = 0;
        for (const semesterCourses of Object.values(this.assignedCourses)) {
            for (const course of semesterCourses) {
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
        } else {
            this.state.avgGrade = averageGrade;
        }
    }

    toggleClearOnClick(course: Course, event: React.MouseEvent<HTMLDivElement>): void {
        event.preventDefault();
        course.cleared = !course.cleared;
        this.save();
        this.setState({});
    }

    onGradeInputChange(course: Course, newValue: string) {
        let val = newValue;
        while (val.charAt(0) === '0')
            val = val.substring(1);

        const regex = /^[12345](\.[037]?)?$/;
        if (val === '' || val.match(regex)) {
            if (val.endsWith('.')) val += '0';
            if (val === '') val = '0';
            course.grade = Number(val);
            course.gradeString = newValue;
            this.recalcGrades();
        }
    }

    onCourseDragStart(courseId: string, event: React.DragEvent<HTMLDivElement>): void {
        this.dropData = courseId;
        event.dataTransfer.setData('text', courseId);
    }

    onCourseDragOver(targetList: Course[], event: React.DragEvent<HTMLDivElement>): void {
        const courseId = event.dataTransfer.getData('text');

        // check if we are allowed to drop the course
        const course: Course | null = ((): Course | null => {
            for (const courseList of [...Object.values(this.assignedCourses), this.availableCourses]) {
                if (courseList === targetList) continue; // do not move a course from a list into the same list
                for (const course of courseList) {
                    if (course.id === courseId) {
                        return course;
                    }
                }
            }
            return null;
        })();

        if (!course) {
            return;
        }

        event.currentTarget.classList.add('is-dragged-over');
        event.preventDefault();
    }

    onCourseDragOut(event: React.DragEvent<HTMLDivElement>) {
        event.currentTarget.classList.remove('is-dragged-over');
    }

    onCourseDrop(targetList: Course[], event: React.DragEvent<HTMLDivElement>): void {
        const courseId = event.dataTransfer.getData('text');

        // find and remove course from all assignments
        const course: Course | null = ((): Course | null => {
            for (const courseList of [...Object.values(this.assignedCourses), this.availableCourses]) {
                if (courseList === targetList) continue; // do not move a course from a list into the same list

                for (const course of courseList) {
                    if (course.id === courseId) {
                        const courseIndex = courseList.indexOf(course);
                        courseList.splice(courseIndex, 1);
                        return course;
                    }
                }
            }
            return null;
        })();

        if (!course) {
            return;
        }

        targetList.push(course);
        event.preventDefault();
        event.currentTarget.classList.remove('is-dragged-over');
        this.setState({});
        this.save();
    }


    render() {

        return (
            <div className={'study-manager-master'}>

                <table>
                    <thead>
                    <tr>
                        <th>1. Semester</th>
                        <th>2. Semester</th>
                        <th>3. Semester</th>
                        <th>4. Semester</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        {Object.values(this.assignedCourses).map((semester, index) =>
                            <td key={index}>
                                {semester.map(course =>
                                    this.renderCourse(course)
                                )}
                                {(index < 3 || semester.length < 1) &&
                                    <div className={'drop-space'}
                                         onDragOver={e => this.onCourseDragOver(semester, e)}
                                         onDragExit={e => this.onCourseDragOut(e)}
                                         onDrop={e => this.onCourseDrop(semester, e)}
                                    >
                                        Drop here
                                    </div>
                                }
                            </td>
                        )}
                    </tr>
                    </tbody>

                    <tfoot>
                    {this.renderTableFooter()}
                    </tfoot>
                </table>

                {this.renderAvailableCourses()}

                <PopUp isOpen={this.state.showInfoPopup} onClose={() => this.setState({showInfoPopup: false})}>
                    <h3>INFO-BASIS</h3>
                    <p>
                        Der Studienbereich INFO-BASIS wird für das nachholen von Grundlagen-Kursen aus dem Bachelor verwendet.
                        Dies beschränkt sich jedoch auf das erforderliche oder angeordnete Nachholen von Kursen und
                        schließt nicht das freiwillige anrechnen ein. Bei den Studienbereichs-Anforderungen wird INFO-BASIS
                        gemeinsam mit INFO-FOKUS gewertet und ist für die meisten Studierenden nicht relevant.
                    </p>
                    <h3>INFO-FOKUS</h3>
                    <p>
                        Der Studienbereich INFO-FOKUS bietet Raum für beliebige Informatik-Veranstaltungen, sofern diese
                        als Master-Veranstaltung geltend gemacht werden können. Für die meisten Studierenden füllt
                        INFO-FOKUS beinahe oder sogar gänzlich die geteilten Studienbereichs-Anforderungen zwischen
                        INFO-BASIS und INFO-FOKUS.
                    </p>
                    <h3>INFO-INFO</h3>
                    <p>
                        Der Studienbereich INFO-INFO erlaubt das Anrechnen von beliebigen Informatik-Veranstaltungen.
                        Dazu zählen sowohl Bachelor-, als auch Master-Veranstaltungen, sowie Sonderfälle wie Forschungsprojekte.
                        Es können somit Kurse aus dem Bachelor nachgeholt oder übernommen werden. Wird ein
                        Forschungsprojekt (Aktive Mitarbeit an einem universitären Forschungsprojekt) belegt, dann muss
                        dieses in den INFO-INFO Berech gewertet (oder verworfen) werden.
                    </p>
                </PopUp>

            </div>
        );
    }

    renderTableFooter(): ReactElement {
        const courseListECTSMapper = (carry: number, course: Course) => {
            return carry + (course.cleared ? course.ects : 0)
        };

        const totalECTSS1 = this.assignedCourses.s1.reduce(courseListECTSMapper, 0)
        const totalECTSS2 = this.assignedCourses.s2.reduce(courseListECTSMapper, 0)
        const totalECTSS3 = this.assignedCourses.s3.reduce(courseListECTSMapper, 0)
        const totalECTSS4 = this.assignedCourses.s4.map(s => s).reduce(courseListECTSMapper, 0)
        const totalECTS = totalECTSS1 + totalECTSS2 + totalECTSS3 + totalECTSS4;

        const courseAssignmentECTSCounter = (tag: AvailableTags) => {
            let sumEcts = 0;
            for (const courseList of Object.values(this.assignedCourses)) {
                for (const course of courseList) {
                    if (course.selectedTag === tag) {
                        sumEcts += course.ects;
                    }
                }
            }
            return sumEcts;
        };
        const totalECTSPrak = courseAssignmentECTSCounter('INFO-PRAK');
        const totalECTSTech = courseAssignmentECTSCounter('INFO-TECH');
        const totalECTSTheo = courseAssignmentECTSCounter('INFO-THEO');
        const totalECTSInfo = courseAssignmentECTSCounter('INFO-INFO');
        const totalECTSBasis = courseAssignmentECTSCounter('INFO-BASIS');
        const totalECTSFokus = courseAssignmentECTSCounter('INFO-FOKUS');

        const totalGrade = (() => {
            let grade = 0;
            let ects = 0;
            for (const courseList of Object.values(this.assignedCourses)) {
                for (const course of courseList) {
                    if (course.cleared && !!course.grade) {
                        grade += course.grade * course.ects;
                        ects += course.ects;
                    }
                }
            }
            return grade / (ects || 1);
        })();


        return (
            <>
                <tr>
                    <td>{totalECTSS1} ECTS</td>
                    <td>{totalECTSS2} ECTS</td>
                    <td>{totalECTSS3} ECTS</td>
                    <td>{totalECTSS4} ECTS</td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        ECTS Gesamt: {totalECTS} / 120 <br />
                        Note Gesamt: {totalGrade.toPrecision(2)} <br />
                    </td>
                </tr>
                <tr>
                    <td colSpan={4}></td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <div style={{display: 'flex', gap: '2rem', justifyContent: 'center'}}>
                            <div><span style={{fontWeight: 'bold'}}>PRAK</span> &nbsp; {totalECTSPrak}/18</div>
                            <div><span style={{fontWeight: 'bold'}}>TECH</span> &nbsp; {totalECTSTech}/18</div>
                            <div><span style={{fontWeight: 'bold'}}>THEO</span> &nbsp; {totalECTSTheo}/18</div>
                            <div><span style={{fontWeight: 'bold'}}>INFO</span> &nbsp; {totalECTSInfo}/18</div>
                            <div><span style={{fontWeight: 'bold'}}>BASIS & FOKUS</span> &nbsp; {totalECTSBasis + totalECTSFokus}/18</div>
                        </div>

                    </td>
                </tr>
            </>
        );
    }

    renderAvailableCourses(): ReactElement {
        return (
            <div className={'available-course-list'}
                 onDragOver={e => this.onCourseDragOver(this.availableCourses, e)}
                 onDrop={e => this.onCourseDrop(this.availableCourses, e)}
            >
                {
                    this.availableCourses.map((course) => this.renderCourse(course, true))
                }

                <div className={'course create-new-course'}>
                    <input type={'text'} placeholder={'Titel'} value={this.state.newCourseTitle} onChange={(event) => {
                        this.setState({newCourseTitle: event.target.value});
                    }}/>
                    <label>
                        <input type={'number'} value={this.state.newCourseEcts} min={1} max={15} onChange={(event) => {
                            this.setState({newCourseEcts: parseInt(event.target.value)});
                        }}/> ECTS
                    </label>


                    <CustomMultiSelect
                        options={availableTagList.map(availableTag => {
                            return {
                                value: availableTag as AvailableTags,
                                label: availableTag,
                                tagLabel: availableTagTranslation[availableTag],
                                selected: this.state.newCourseTypes.includes(availableTag),
                            }
                        })}
                        onSelectionChanged={(newSelection) => {
                            this.setState({newCourseTypes: newSelection})
                        }}
                    />

                    <div className={'button-row'}>
                        <button onClick={this.createNewCourse.bind(this)}>Erstellen</button>

                        <span className={'info-button'} onClick={() => this.setState({showInfoPopup: true})}>
                            <i className={'fac-icon'}>
                            <FontAwesomeIcon icon={['fas', 'info']} />
                        </i>
                        </span>
                    </div>
                </div>

            </div>
        );
    }

    renderCourse(course: Course, allowRemoval: boolean = false): ReactElement {
        return (
            <div className={'course ' + (course.cleared && 'cleared')}
                 onContextMenu={e => this.toggleClearOnClick(course, e)}
                 onDragStart={e => this.onCourseDragStart(course.id, e)}
                 draggable={true}
                 key={course.id}
            >
                <div className={'row'}>
                    <span className={"label"}>Titel</span>&nbsp;
                    <span>{course.title} &nbsp; ({course.ects} ECTS)</span>
                </div>

                <div className={'row'}>
                    <span className={"label"}>Bereich</span>&nbsp;
                    <select
                        onChange={(e) => {
                            course.selectedTag = e.target.value as AvailableTags;
                            this.save();
                            this.setState({});
                        }}
                        value={course.selectedTag}
                    >
                        {course.tags.map(tag =>
                            <option key={tag} value={tag}>{tag}</option>)}
                    </select>
                </div>

                <div className={'row'}>
                    <span className={"label"}>Note</span> &nbsp;
                    <span className={'grade'}>
                        <span>{course.grade ? course.grade.toPrecision(2) : '-'}</span>
                        <label>
                            <input
                                type={"text"}
                                pattern={'[12345](\.[037])?'}
                                value={course.gradeString || (course.grade ? course.grade.toPrecision(2) : '')}
                                onChange={e => this.onGradeInputChange(course, e.currentTarget.value)}
                            ></input>
                        </label>
                    </span>
                </div>

                {allowRemoval &&
                    <span className={'remove-free-course'}>X</span>
                }
            </div>
        );
    }

    createNewCourse(): void {
        if (this.state.newCourseTitle === '' || this.state.newCourseTypes.length === 0) {
            return;
        }

        this.availableCourses.push({
            id: Math.random().toString(36),
            title: this.state.newCourseTitle,
            ects: this.state.newCourseEcts,
            cleared: false,
            tags: this.state.newCourseTypes,
            selectedTag: this.state.newCourseTypes[0]
        });

        this.setState({
            newCourseEcts: 3,
            newCourseTitle: '',
            newCourseTypes: []
        });
        this.save();
    }

    deleteAvailableCourse(course: Course) {
        const index = this.availableCourses.indexOf(course);
        this.availableCourses.splice(index, 1);
        this.setState({});
        this.save();
    }

}
