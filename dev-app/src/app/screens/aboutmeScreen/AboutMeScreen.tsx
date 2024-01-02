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
                            a software engineer from Germany. I have a passion for conceptualizing and developing new things or new functionality.
                            There is nothing better than to create something new and make the world bigger step by step, if you ask me.
                            I enjoy working in a team to combine the strengths and discuss about projects, to get the best out of it.
                            But just as much do i like working by myself and ponder over my code, even though design is not my greatest skill.
                            That mirrors in my main hobbies, besides coding awesome stuff: swimming as part of the <a href={'https://www.dlrg.de'}>DLRG</a> and engaging myself socially in a local youth group.
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
                                    Coding in many languages, but primarily focusing on Javascript/Typescript and PHP
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={['fas', 'clipboard-list']} />
                                    Project planing, organizing and maintaining
                                </li>
                                <li>
                                    <i className={'fac-icon'}>
                                        <FontAwesomeIcon icon={['fas', 'laptop-code']} />
                                    </i>
                                    Using and extending web-frameworks like Symfony or Shopware
                                </li>
                                <li>
                                    <i className={'fac-icon'}>
                                        <ReactSVG src={ReactJsIcon} />
                                    </i>
                                    Creating One-Page Applications with ReactJS and Android Apps with React Native
                                </li>
                                <li>
                                    <i className={'fac-icon'}>
                                        <FontAwesomeIcon icon={['fas', 'code-branch']} />
                                    </i>
                                    Structuring workflows with the VCS Git and related services like GitHub or GitLab
                                </li>
                            </ul>
                        </div>

                        <div className={'simple-col flex-col'}>
                            <div className={'h4'}>Timeline</div>

                            <ul className={'timeline'}>
                                <li>
                                    <div className={'emphasized'}>2022 - today</div>
                                    Studying Computer Science at the <a href={'https://uni-tuebingen.de/'}>Eberhard Karls University</a> in Tübingen
                                </li>
                                <li>
                                    <div className={'emphasized'}>2019 - 2022</div>
                                    Trainee as Information Science Technician specialising in application/web development at <a href={'https://7thsense.de'}>7thSENSE GmbH</a>
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