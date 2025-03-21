import React, {Component} from "react";
import {P5CanvasInstance, ReactP5Wrapper} from "react-p5-wrapper";
import HighlandGothicFont from "../../../../resources/fonts/HighlandGothicFLF.ttf";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default class ListmeApp extends Component<{}, {}> {


    render() {
        return (
            <div className={'listme-app'}>

                <h2>Listme App</h2>
                <div className={'description'}>
                    <div>
                        Organisiere dein Leben jetzt mit Listme. <br/>
                        Führe Listen und erstelle, lösche, bearbeite, verschiebe, kopiere oder markiere Einträge.
                    </div>
                    <img src={require('../../../../resources/images/listme_icon.png')} alt={'Listme APP Logo'}/>
                </div>

                <h3>Download</h3>
                <table>
                    <thead>
                    <tr>
                        <td>Betriebssystem</td>
                        <td>Version</td>
                        <td>Download-Link</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Android</td>
                        <td>v1.4.0</td>
                        <td>
                            <a href="https://storage.fabianholzwarth.de/listme_v1_4_0b.apk" target={"_blank"}>Download</a>
                        </td>
                    </tr>
                    <tr>
                        <td>IOS</td>
                        <td></td>
                        <td>
                            Auf Anfrage
                        </td>
                    </tr>
                    </tbody>
                </table>

                <h4>SHA256 Hash-sums</h4>
                <table>
                    <tbody>
                    <tr>
                        <td>Android</td>
                        <td className={'sha'}>d6c39044acb810de22c69eb8795463a73cd91cb728fac5af46104c44a0163290</td>
                    </tr>
                    </tbody>
                </table>


                <h3>Features</h3>
                <div className={'feature-container'}>
                    <div className={'feature'}>Speichere Listen lokal nur auf deinem Gerät oder remote in der Cloud
                    </div>
                    <div className={'feature'}>Teile Listen in der Cloud mit anderen Nutzern</div>
                    <div className={'feature'}>Durchsuche alle Listen nach Keywords</div>
                    <div className={'feature'}>Sorge mit Tags für Ordnung und filtere oder sortiere Inhalte</div>
                    <div className={'feature'}>Verschiebe selten genutzte Listen in das Archiv</div>
                </div>

            </div>
        );
    }
}