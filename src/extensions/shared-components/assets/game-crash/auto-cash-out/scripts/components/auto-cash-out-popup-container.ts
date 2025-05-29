import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";

import { NodeContainer } from "../../../../shared/common-components/node-container/node-container";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoCashOutPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    @render(gc.GameCrash.AutoCashOut.AutoCashOutPopupStore, (store) => store.enable)
    openPopup(enable: boolean) {
        this.nodeOverlay.active = enable;
        if (this.node.children.length > 1) {
            return;
        }

        this.createNode();
    }

    @handle(gc.GameCrash.AutoCashOut.AutoCashOutPopupHandler, (handle, enable: boolean) => handle.togglePopup(enable))
    closePopup() {
        return false;
    }
}
