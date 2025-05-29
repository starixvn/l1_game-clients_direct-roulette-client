import gc from "@sg/game-client-base";
import { _decorator, Node, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class LeaderBoardContainer extends ObserverComponent {
    @property(Node)
    nodeArrowIcon: Node = null;

    @property(Node)
    nodeLeaderBoardContent: Node = null;

    private isExpandedBoard = false;

    onClickCollapseButton(e) {
        this.isExpandedBoard = !this.isExpandedBoard;
        this.playSoundClick();
        this.nodeArrowIcon.eulerAngles = this.isExpandedBoard ? v3(0, 0, 180) : v3(0, 0, 0);
        this.nodeLeaderBoardContent.active = this.isExpandedBoard;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
