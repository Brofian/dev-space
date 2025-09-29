import {Component} from "react";
import profileImage from "../../../resources/images/profile_image.png";
import GoBackButton from "../../shared/elements/goBackButton/GoBackButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactSVG} from "react-svg";
import ReactJsIcon from "../../../resources/images/icons/react.svg";

export default class AboutMeScreen extends Component<{}, {}> {

    getAge(): number {
        const timeGap = (new Date()).getTime() - (new Date('09/03/2000')).getTime();
        return (new Date(timeGap)).getFullYear() - 1970;
    }

    render() {
        return (
            <>
                <GoBackButton />

                <div className={'flex-col about-container'}>

                    <div className={'flex-row about-head'}>
                        <img
                            className={'profile-picture'}
                            src={profileImage} alt={"Profile"}
                            title={"Profile image: Fabian Holzwarth"}
                        />

                        <div className={'profile-introduction'}>
                            <div className={'h3'}>Hello, i'm Fabian,</div>
                            a full-stack software developer from Germany. I have a passion for conceptualizing and developing new things or new functionality.
                            Making the world [wide web] bigger one line at a time. While my professional focus is on web development and e-commerce,
                            I enjoy learning about new and old technologies, strategies, algorithms and possibilities of all kind and all areas of computer science.
                            While it is quite enjoyable to ponder alone over a problem, the interaction with a team or colleagues is also something that I value highly.
                            Being able to combine everyone's strength, discuss about projects and learn new things together can make even tedious tasks bearable.
                            <br />
                            Other than developing software, i also enjoy playing relaxing games like Stardew Valley or Minecraft. Going for a swim or meeting up
                            with friends for a boardgame night are very good distractions to work as well.
                        </div>
                    </div>


                    <div className={'flex-row about-details'}>

                        <div className={'simple-col flex-col'}>
                            <div className={'h4'}>Profile</div>
                            <ul className={'hide-bullet'}>
                                <li>
                                    <div className={'emphasized'}>Full Name</div>
                                    Fabian Holzwarth
                                </li>
                                <li>
                                    <div className={'emphasized'}>E-mail</div>
                                    <a href={'mailto:info@fabianholzwarth.de'}>info@fabianholzwarth.de</a>
                                </li>
                                <li>
                                    <div className={'emphasized'}>Age</div>
                                    {this.getAge()}
                                </li>
                                <li>
                                    <div className={'emphasized'}>Favourite Pizza</div>
                                    Prosciutto
                                </li>
                            </ul>
                        </div>

                        <div className={'simple-col flex-col'}>
                            <div className={'h4'}>Skills</div>
                            <ul className={'svg-bullets'}>
                                <li>
                                    <FontAwesomeIcon icon={['fas', 'code']} />
                                    Coding in many languages, but primarily focusing on Typescript and PHP
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={['fas', 'clipboard-list']} />
                                    Project planing, organizing and maintaining
                                </li>
                                <li>
                                    <i className={'fac-icon'}>
                                        <FontAwesomeIcon icon={['fas', 'laptop-code']} />
                                    </i>
                                    Experience in working with web-frameworks like Symfony or Shopware
                                </li>
                                <li>
                                    <i className={'fac-icon'}>
                                        <ReactSVG src={ReactJsIcon} />
                                    </i>
                                    Creating One-Page Applications with JS Frameworks like React [native], Electron,
                                    NextJS, etc
                                </li>
                                <li>
                                    <i className={'fac-icon'}>
                                        <FontAwesomeIcon icon={['fas', 'code-branch']} />
                                    </i>
                                    Structuring workflows with the VCS Git and related services like GitHub or GitLab
                                </li>
                                <li>
                                    <i className={'fac-icon'}>
                                        <FontAwesomeIcon icon={['fas', 'microchip']} />
                                    </i>
                                    Implementation of and enhanced Workflow by AI (actively opposing Vibe-Coding!)
                                </li>
                            </ul>
                        </div>

                        <div className={'simple-col flex-col'}>
                            <div className={'h4'}>Timeline</div>

                            <ul className={'timeline'}>
                                <li>
                                    <div className={'emphasized'}>2025 - today</div>
                                    M.Sc. Computer Science at the <a href={'https://uni-tuebingen.de/'}>Eberhard Karls University</a> in Tübingen
                                </li>
                                <li>
                                    <div className={'emphasized'}>2022 - 2025</div>
                                    B.Sc. Computer Science at the <a href={'https://uni-tuebingen.de/'}>Eberhard Karls University</a> in Tübingen
                                </li>
                                <li>
                                    <div className={'emphasized'}>2019 - 2022</div>
                                    Trainee as Information Science Technician specialising in web-application development at <a href={'https://7thsense.de'}>7thSENSE GmbH</a>
                                </li>
                                <li>
                                    <div className={'emphasized'}>2019</div>
                                    Graduate at the HAP Grieshaber Gymnasium
                                </li>
                            </ul>
                        </div>

                    </div>


                </div>
            </>
        );
    }


}