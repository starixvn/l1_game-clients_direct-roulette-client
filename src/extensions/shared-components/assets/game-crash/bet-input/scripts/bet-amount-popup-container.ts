import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";

import { NodeContainer } from "../../../shared/common-components/node-container/node-container";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class BetAmountPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    @render(gc.GameCrash.BetInput.BetInputStore, (store) => store.isOpenBetAmountPopup)
    private renderOpenBetAmountPopup(isOpenBetAmountPopup: boolean) {
        this.nodeOverlay.active = isOpenBetAmountPopup;

        if (this.node.children.length > 1) {
            return;
        }

        this.createNode();
    }

    @handle(gc.GameCrash.BetInput.BetInputHandler, (handle) => handle.closeBetAmountPopup())
    private onClickCloseBetAmountPopup(event) {}
}
