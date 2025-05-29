import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import WebViewVerification from "db://shared-components/game/verification-popup/scripts/web-view-verification";
import Observer from "observer";

const { PFVerification } = gc;
const { handle, render } = Observer;
const { ccclass, property } = _decorator;

@ccclass
export default class WebViewVerificationDirect extends WebViewVerification {
    @property({ override: true, visible: false })
    lblRound: Label = null;

    initUrl(specialDirection = "", scrollToId = "") {
        const theme = "blue";
        specialDirection += "&o=portrait";
        return { theme, specialDirection, scrollToId };
    }
}
