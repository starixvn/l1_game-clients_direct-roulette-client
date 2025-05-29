import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";

import { BaseBetDetailSummaryTable } from "../../../game/bet-history/scripts/components/bet-detail/bet-detail-summary-table";

const { ccclass, property } = _decorator;
const { FormatUtils } = gc;

@ccclass()
export class BetDetailSummaryTable extends BaseBetDetailSummaryTable {
    @property(Label)
    lblRound: Label = null;

    @property(Label)
    lblCrashPoint: Label = null;

    renderResult(model: gc.BetHistory.BetDetailModel) {
        const { roundId, result } = model.betHistoryLog;
        this.lblRound.string = roundId.toString();
        this.lblCrashPoint.string = `${FormatUtils.numberWithCommas(+result, 2, false)}x`;
    }
}
