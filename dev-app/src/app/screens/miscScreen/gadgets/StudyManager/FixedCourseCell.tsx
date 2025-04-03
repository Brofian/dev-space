import React, {Component} from "react";
import {Course} from "../StudyManager";

interface IProps {
    course: Course,
    ectsIndex: number,
    semesterIndex: number,
    toggleClearOnClick: {(event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>): void},
    recalcGrades: {(): void},
}

interface IState {
    gradeString: string;
}

export default class FixedCourseCell extends Component<IProps, IState>{

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
            ectsIndex,
            semesterIndex
        } = this.props;

        return (
            <td key={'cell_' + ectsIndex + '_' + semesterIndex}
                rowSpan={course.ects}
                className={course.cleared ? 'cleared' : ''}
                onContextMenu={this.props.toggleClearOnClick}
            >
                {course.title} <br/>
                ({course.ects} ECTS)

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


            </td>
        );
    }
}
