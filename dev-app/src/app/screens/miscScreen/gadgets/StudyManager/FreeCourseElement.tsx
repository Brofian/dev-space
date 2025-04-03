import React, {Component} from "react";
import {Course, FreeCourse} from "../StudyManager";

interface IProps {
    course: FreeCourse;
    index: number;
    getLabelFromTag: {(): string}
    onFreeCourseDragStart: {(event: React.DragEvent<HTMLTableDataCellElement>): void}
    deleteUnassignedFreeCourse: {(): void}
    toggleClearOnClick: {(event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>): void};
    recalcGrades: {(): void};
}

interface IState {
    gradeString: string;
}

export default class FreeCourseElement extends Component<IProps, IState>{

    state: IState = {
        gradeString: ""
    }

    constructor(props: IProps) {
        super(props);
        this.state.gradeString = (props.course.grade || 0).toString();
    }

    onGradeInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        let val = (event.target as HTMLInputElement).value;
        while (val.charAt(0) === '0')
            val = val.substring(1);


        const regex = /^[12345](\.[037]?)?$/;
        if (val === '' || val.match(regex)) {
            this.setState({
                gradeString: val
            });

            if (val.endsWith('.')) val += '0';
            if (val === '') val = '0';

            this.props.course.grade = Number(val);
            this.props.recalcGrades();
        }
    }


    render() {

        const {
            course,
            index
        } = this.props;

        return (
            <div className={'free-course ' + (course.cleared && 'cleared')}
                 onContextMenu={this.props.toggleClearOnClick}
                 onDragStart={this.props.onFreeCourseDragStart}
                 draggable={true}
            >
                {course.title} <br/>
                ({course.ects} ECTS) - {this.props.getLabelFromTag()}

                <div className={'grade'}>
                    <span>{course.grade ? course.grade.toPrecision(2) : ''}</span>
                    <label>
                        <input
                            type={"text"}
                            pattern={'\d+(\.{037})?'}
                            value={this.state.gradeString}
                            onChange={this.onGradeInputChange.bind(this)}
                        ></input>
                    </label>
                </div>


                <span className={'remove-free-course'}
                      onClick={this.props.deleteUnassignedFreeCourse}>X</span>
            </div>
        );
    }
}
