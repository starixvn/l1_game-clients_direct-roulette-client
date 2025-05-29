import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class BetAmount extends ObserverComponent {
    @property(Node)
    nodeDisabledBetAmount: Node = null;

    setDisplayOverlayNode(isShow: boolean) {
        this.nodeDisabledBetAmount.active = isShow;
    }

    @render(gc.GameCrash.PlayerActions.PlayerActionStore, (store) => store.disableBetAmount)
    adjustBetAmount(visibleBetAmount: boolean) {
        this.setDisplayOverlayNode(visibleBetAmount);
    }
}
