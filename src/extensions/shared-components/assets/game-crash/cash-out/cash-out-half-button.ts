import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";

import { CashOutButtonBase } from "./cash-out-button-base";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Bet, FormatUtils } = gc;

@ccclass
export class CashOutHalfButton extends CashOutButtonBase {
    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.halfCashOutValue, { fireImmediately: false })
    renderHalfCashOutValue(halfCashOutValue: number) {
        this.setCashOutValue(halfCashOutValue);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) =>
        cashOutHandler.handle(cashOutValue, true)
    )
    onClickCashOutHalf() {
        return this.onClickBase();
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.disabledHalfCashOut)
    disabledHalfCashOut(disabledHalfCashOut: boolean) {
        this.sprDisabled.node.active = disabledHalfCashOut;
    }
}
