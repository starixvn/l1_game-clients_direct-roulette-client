import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";
import BetHistoryBodyItem from "../../../game/bet-history/scripts/components/bet-history-body-item";
const { GameCrash } = gc;
const { ccclass, property } = _decorator;
const { handle } = Observer;
@ccclass
export class CrashGameBetHistoryBodyItem extends BetHistoryBodyItem {
    @property({ override: true, visible: false })
    lblDate: Label = null;

    @property({ override: true, visible: false })
    lblHour: Label = null;

    @handle(GameCrash.ProvablyFair.ProvablyFairHandler, (handle, roundId: number) => handle.openVerificationHistory(roundId))
    onClickVerify() {
        this.playSoundClick();
        return this.betHistoryLog.roundId;
    }
}
