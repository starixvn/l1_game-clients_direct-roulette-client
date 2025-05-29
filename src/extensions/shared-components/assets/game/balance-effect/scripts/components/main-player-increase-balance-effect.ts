import { _decorator } from "cc";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalance } from "../stores/balance-effect-store";
import { BalanceContainer } from "./balance-effect";

const { ccclass } = _decorator;
const { render } = Observer;

@ccclass()
export class MainPlayerIncreaseBalanceEffect extends BalanceContainer {
    @render(BalanceEffectStore, (store) => store.increaseBalanceMainPlayer, { fireImmediately: false })
    increaseBalanceMainPlayer(balanceWhenMainPlayerPayout: TUpdateBalance) {
        this.updateBalanceWhenPlayerBet(balanceWhenMainPlayerPayout?.balanceEffect);
    }
}
