import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class PopupsGame extends ObserverComponent {
    @render(gc.GameCrash.Popups.PopupsGameStore, (store) => store.enabledOverlay)
    setDisplayOverlayBg(enabledOverlay: boolean) {
        this.node.active = enabledOverlay;
    }
}
