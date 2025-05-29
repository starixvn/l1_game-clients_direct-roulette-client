import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { handle } = Observer;
const { FormatUtils, GameCrash } = gc;
@ccclass
export class BetAmountItem extends ObserverComponent {
    @property(Label)
    lblBetAmount: Label = null;

    setBetAmountItem(amount: string) {
        this.node.name = amount;
        this.lblBetAmount.string = `+${FormatUtils.nFormatter(+amount)}`;
    }

    @handle(GameCrash.BetInput.BetInputHandler, (handle, amount: number) => handle.setBetAmountTemp(amount))
    private onClickBetAmountItem(event) {
        this.playSoundClick();
        return +event.target.name;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
