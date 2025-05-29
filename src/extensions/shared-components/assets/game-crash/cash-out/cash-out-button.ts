import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";

import { CashOutButtonBase } from "./cash-out-button-base";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash } = gc;

@ccclass
export class CashOutButton extends CashOutButtonBase {
    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.fullCashOutValue, { fireImmediately: false })
    renderFullCashOutValue(fullCashOutValue: number) {
        this.setCashOutValue(fullCashOutValue);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) =>
        cashOutHandler.handle(cashOutValue, false)
    )
    onClickCashOut() {
        return this.onClickBase();
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.disabledFullCashOut)
    disabledFullCashOut(disabledFullCashOut: boolean) {
        this.sprDisabled.node.active = disabledFullCashOut;
    }
}
