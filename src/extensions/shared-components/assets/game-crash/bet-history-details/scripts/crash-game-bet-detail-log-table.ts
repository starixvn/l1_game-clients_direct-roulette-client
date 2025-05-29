import gc from "@sg/game-client-base";
import { _decorator, Prefab } from "cc";
import { reverse } from "lodash-es";

import { BetDetailLogTable } from "../../../game/bet-history/scripts/components/bet-detail/bet-detail-log-table";
import { ReachMaxWin } from "./reach-max-win";

const { ccclass, property } = _decorator;
interface IBetDetailLog {
    amount: number;
    winAmount: number;
    multiplier: number | null;
    time: string | null;
    action: string;
}

@ccclass
export class CrashGameBetDetailLogTable extends BetDetailLogTable {
    @property(ReachMaxWin)
    cpnReachMaxWin: ReachMaxWin = null;

    showBetDetail(bodyItemPrefab: Prefab, model: gc.BetHistory.BetDetailModel) {
        const { fractionalOddsFormat, betHistoryLog } = model;
        const { result, settlementResult, odds, freeBet, betLogDetails } = betHistoryLog;
        const reversedLogs = reverse([...betLogDetails]);

        this.cpnReachMaxWin?.setData(reversedLogs);
        reversedLogs.forEach((betDetailsLog, index) => {
            this.body.addChild(
                this.buildBodyRow(bodyItemPrefab, {
                    betDetailsLog,
                    index,
                    odds,
                    settlementResult,
                    result,
                    freeBet,
                    fractionalOddsFormat,
                })
            );
        });
    }
}
