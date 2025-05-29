import { _decorator } from "cc";
import { Dialog } from "../../../../shared/common-components/dialogs/dialog";
import { GameGuideContainer } from "../../../../game/game-guide/scripts/game-guide-container";

const { ccclass } = _decorator;

@ccclass("GameGuideLandscapeContainer")
export class GameGuideLandscapeContainer extends GameGuideContainer {
    onLoad() {
        super.onLoad();
        window.addEventListener("message", this.handleEventFromParent.bind(this));
    }

    handleEventFromParent(event: MessageEvent) {
        if (event.data.openGameGuide) {
            const dialogNode = this.node?.getComponentInChildren(Dialog);
            if (dialogNode) {
                dialogNode.hide();
                return;
            }

            this.openDialog();
        }
    }
}
