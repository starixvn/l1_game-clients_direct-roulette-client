import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";

import { BalanceEffectHandlers } from "../../../game/balance-effect/scripts/handlers/balance-effect-handlers";
import GameComponent from "../../../game/scripts/components/game-component";

const { Settlements, Auth, Rounds, GameCrash } = gc;

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class GameCrashComponent extends GameComponent {
    @property({ type: Label, override: true, visible: false })
    lblMinBet: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblMaxBet: Label = null;

    private readonly countDownSound = "count_down";

    override isValidResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        return result;
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        const multiplier = +result;
        this.updateCurrMultiplier(multiplier);
        super.finishShowResult(result, settlementResult);
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    startNewRound(isStartRound: boolean) {
        super.startNewRound(isStartRound);
        this.resetValueCashOutLeaderBoard();
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus)
    showPayoutForMainPlayer(settlementStatus) {
        if (settlementStatus?.win) {
            this.mainPlayerIncreaseBalance(settlementStatus?.bet);
            this.mainPlayerPlayWinningEffect();
            this.getBalance();
        }
    }

    @handle(BalanceEffectHandlers.MainPlayerIncreaseBalance)
    mainPlayerIncreaseBalance(balance: number) {
        return balance;
    }

    @handle(BalanceEffectHandlers.MainPlayerWinEffect)
    mainPlayerPlayWinningEffect() {
        return true;
    }

    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}

    @handle(GameCrash.CrashMultiplier.MultiplierHandlers, (handle, multiplier: number) => handle.handleMultiplierCrashed(multiplier))
    updateCurrMultiplier(value: number) {
        return value;
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (handle) => handle.resetCashOutValue())
    resetValueCashOutLeaderBoard() {}

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @render(Rounds.RoundTimeStore, (store) => store.roundTime)
    playSoundCountDown(roundTime: number) {
        if (roundTime > 0 && roundTime < 11) {
            this.playSound(this.countDownSound);
        }
    }
}
