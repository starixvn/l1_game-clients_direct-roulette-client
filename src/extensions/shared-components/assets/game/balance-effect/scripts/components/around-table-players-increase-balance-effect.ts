import { _decorator } from "cc";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalances } from "../stores/balance-effect-store";
import { BalanceContainer } from "./balance-effect";

const { ccclass } = _decorator;
const { render } = Observer;

@ccclass()
export class AroundTablePlayersIncreaseBalanceEffect extends BalanceContainer {
    @render(BalanceEffectStore, (store) => store.increaseBalanceAroundTablePlayers, { fireImmediately: false })
    increaseBalanceAroundTablePlayers(payoutBalanceAroundTablePlayers: TUpdateBalances) {
        if (payoutBalanceAroundTablePlayers?.balanceEffects) {
            payoutBalanceAroundTablePlayers.balanceEffects.forEach((balanceEffect) => {
                this.updateBalanceWhenPlayerBet(balanceEffect);
            });
        }
    }
}
