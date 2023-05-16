import {Component} from "react";
import GoBackButton from "../../shared/elements/goBackButton/GoBackButton";
import ProjectList from "./ProjectList";

export default class ShowcaseScreen extends Component<{}, {}> {

    static i = 0;

    render() {
        return (
            <>
                <GoBackButton />

                <div className={'timeline-container'}>

                    <ul className={'project-timeline timeline'}>

                        {
                            ProjectList.map(project =>
                                <li className={'project-entry'}>
                                    <div className={'project-container'}>
                                        <div className={'h4 project-title'}>{project.title} {project.version && `v${project.version}`} {project.year && `(${project.year})`}
                                        </div>

                                        <div className={'project-tags'}>
                                            {project.tags.map(tag =>
                                                <span className={'project-tag'}>{tag}</span>
                                            )}
                                        </div>

                                        <div className={'project-details'}>

                                            <img className={'project-image'}
                                                 src={project.image}
                                                 alt={'Preview: '+project.title}
                                                 title={'Preview: '+project.title} />

                                            <div className={'project-description'}>{project.description}</div>

                                        </div>
                                    </div>
                                </li>
                            )
                        }

                    </ul>

                </div>

            </>
        );
    }
}

