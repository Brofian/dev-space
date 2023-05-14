import {Component} from "react";
import profileImage from "../../../resources/images/profile_image.png";
import GoBackButton from "../../shared/elements/goBackButton/GoBackButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
                            <div className={'h3'}>Hello, i'm Fabian</div>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                        </div>
                    </div>


                    <div className={'flex-row about-details'}>

                        <div className={'simple-col flex-col'}>
                            <div className={'h4'}>Profile</div>
                            <ul className={'hide-bullet'}>
                                <li>
                                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
                                </li>
                                <li>
                                    <div className={'emphasized'}>Full Name</div>
                                    Fabian Holzwarth
                                </li>
                                <li>
                                    <div className={'emphasized'}>Age</div>
                                    {this.getAge()}
                                </li>
                                <li>
                                    <div className={'emphasized'}>Favourite Pizza</div>
                                    Prosciutto with olives
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
                                    <FontAwesomeIcon icon={['fas', 'code']} />
                                    Using and extending the Shopware Framework with Plugins and Themes
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={['fas', 'code']} />
                                    Creating One-Page Applications with ReactJs and Android Apps with React Native
                                </li>
                            </ul>
                        </div>

                        <div className={'simple-col flex-col'}>
                            <div className={'h4'}>Timeline</div>

                            <ul className={'timeline'}>
                                <li>
                                    <div className={'emphasized'}>2019</div>
                                    Graduate at the HAP Grieshaber Gymnasium
                                </li>
                                <li>
                                    <div className={'emphasized'}>2019 - 2022</div>
                                    Trainee as Information Science Technician specialising in application/web development at <a href={'https://7thsense.de'}>7thSENSE GmbH</a>
                                </li>
                                <li>
                                    <div className={'emphasized'}>2022 - today</div>
                                    Studying Computer Science at the <a href={'https://uni-tuebingen.de/'}>Eberhard Karls University</a> in Tübingen
                                </li>
                            </ul>
                        </div>

                    </div>


                </div>
            </>
        );
    }


}