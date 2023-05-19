import {Component} from "react";
import GoBackButton from "../../shared/elements/goBackButton/GoBackButton";
import ProjectList from "./ProjectList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import GithubIcon from "../../../resources/images/icons/github.svg"
import {ReactSVG} from "react-svg";

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
                                <li className={'project-entry'} key={project.id}>
                                    <div className={'project-container'}>
                                        <div className={'h4 project-title'}>{project.title} {project.version && `v${project.version}`} {project.year && `(${project.year})`}
                                        </div>

                                        <div className={'project-tags'}>
                                            {project.tags.map((tag, index) =>
                                                <span className={'project-tag'} key={'tag-'+index}>{tag}</span>
                                            )}
                                        </div>

                                        <div className={'project-details'}>

                                            {
                                                project.image &&
                                                <div className={'project-image-column'}>
                                                    <img className={'project-image'}
                                                         src={project.image}
                                                         alt={'Preview: '+project.title}
                                                         title={'Preview: '+project.title}
                                                         loading="lazy"
                                                    />
                                                </div>
                                            }

                                            <div className={'project-description'}>
                                                {project.description}

                                                { project.githubLink &&
                                                    <a href={project.githubLink} className={'project-github-link'}>
                                                        <button className={'github has-icon'}>
                                                            Github

                                                            <i className={'fac-icon'}>
                                                                <ReactSVG src={GithubIcon} />
                                                            </i>
                                                        </button>
                                                    </a>
                                                }
                                            </div>

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

