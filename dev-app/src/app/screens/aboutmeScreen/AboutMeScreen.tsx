import {Component} from "react";
import profileImage from "../../../resources/images/profile_image.png";
import GoBackButton from "../../shared/elements/goBackButton/GoBackButton";

export default class AboutMeScreen extends Component<{}, {}> {

    render() {
        return (
            <>
                <GoBackButton />

                <div className={'profile-picture'}>
                    <img src={profileImage} alt={"Profile"} title={"Profile image: Fabian Holzwarth"} />
                </div>
            </>
        );
    }


}