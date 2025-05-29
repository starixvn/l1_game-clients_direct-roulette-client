import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { Dialog } from "db://shared-components/shared/common-components/dialogs/dialog";
import Observer from "observer";
import LoadWebView from "../../../shared/common-components/web-view/load-web-view";
const { ccclass, property } = _decorator;
const { handle } = Observer;
@ccclass
export class BetTicketDetails extends LoadWebView {
    openBetDetails(url: string) {
        this.url = url;
        this.loadWebView();
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    onClickClose() {
        const dialogs = this.getComponentsInChildren(Dialog);

        if (dialogs.length > 0) {
            dialogs[0].hide();
        } else {
            this.node.destroy();
        }
    }
}
