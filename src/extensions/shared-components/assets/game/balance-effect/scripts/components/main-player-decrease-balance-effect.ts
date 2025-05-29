import { _decorator } from "cc";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalance } from "../stores/balance-effect-store";
import { BalanceContainer } from "./balance-effect";

const { ccclass } = _decorator;
const { render } = Observer;

@ccclass()
export class MainPlayerDecreaseBalanceEffect extends BalanceContainer {
    isIncrease = false;
    @render(BalanceEffectStore, (store) => store.decreaseBalanceMainPlayer, { fireImmediately: false })
    decreaseBalanceMainPlayer(balanceWhenMainPlayerBet: TUpdateBalance) {
        this.updateBalanceWhenPlayerBet(balanceWhenMainPlayerBet?.balanceEffect);
    }
}
