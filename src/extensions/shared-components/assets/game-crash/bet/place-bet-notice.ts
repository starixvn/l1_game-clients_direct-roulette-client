import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;

const { GameCrash } = gc;
const { handle, render } = Observer;

@ccclass("place_bet_notice")
export class PlaceBetNotice extends ObserverComponent {
    onLoad(): void {
        this.node.active = false;
        super.onLoad();
    }

    showNotice(isShow: boolean) {
        if (isShow) {
            this.node.active = true;
            this.scheduleOnce(() => {
                this.node.active = false;
            }, 3);
        } else {
            this.node.active = false;
        }
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.buttonState)
    handleNotice(buttonState: string) {
        if (buttonState === GameCrash.ButtonState.BET_ACCEPTED) {
            this.showNotice(true);
        }
    }
}
