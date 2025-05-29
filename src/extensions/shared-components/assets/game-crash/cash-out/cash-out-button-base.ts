import gc from "@sg/game-client-base";
import { _decorator, Label, Sprite } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Bet, FormatUtils } = gc;

@ccclass
export class CashOutButtonBase extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property(Sprite)
    sprDisabled: Sprite = null;

    private readonly cashOutSound = "cash_out";

    onLoad() {
        this.emptyCashOutLabel();
        super.onLoad();
    }

    private emptyCashOutLabel() {
        this.lblCashOut.string = "";
    }

    setCashOutValue(value: number) {
        if (value > 0) {
            this.lblCashOut.string = FormatUtils.numberWithCommas(value, 2);
        } else {
            this.emptyCashOutLabel();
        }
    }

    getCashOutValue() {
        return +this.lblCashOut.string;
    }

    setDisplay(visible: boolean) {
        this.node.active = visible;
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.visibleCashOut)
    renderVisibleCashOut(visibleCashOut: boolean) {
        this.setDisplay(visibleCashOut);
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundCashOut() {
        return this.cashOutSound;
    }

    onClickBase() {
        this.playSoundCashOut();
        this.closeAllPopups();
        return this.getCashOutValue();
    }
}
