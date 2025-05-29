import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";

import { NodeContainer } from "../../../../shared/common-components/node-container/node-container";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoPlayPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    @render(gc.GameCrash.AutoPlay.AutoPlayStore, (store) => store.isOpenAutoPlayPopup)
    renderOpenPopup(isOpenAutoPlayPopup: boolean) {
        this.nodeOverlay.active = isOpenAutoPlayPopup;
        if (this.node.children.length > 1) {
            return;
        }

        this.createNode();
    }

    @handle(gc.GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.closeAutoPlayPopup())
    onClickclosePopup() {}
}
