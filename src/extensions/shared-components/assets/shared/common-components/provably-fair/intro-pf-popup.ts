import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import WebViewGuide from "../../../game/game-guide/scripts/web-view-guide";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class IntroPFPopup extends WebViewGuide {
    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    @handle(gc.GuidePF.GuidePFHandlers, (handle) => handle.resetUrl())
    onClosePopup() {}

    @render(gc.GuidePF.GuidePFStore, (store) => store.url)
    openGuidePF(url: string) {
        this.loadContent(url);
    }
}
