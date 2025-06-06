import gc from "@sg/game-client-base";
import { _decorator, Prefab } from "cc";
import { BetDetailLogTable } from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-table";
import { BetDetailLogItemType } from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item";
import { RouletteBetDetailBodyItem } from "./roulette-bet-detail-body-item";

const { ccclass } = _decorator;

@ccclass
export class RouletteBetDetailLogTable extends BetDetailLogTable {
    
    showBetDetail(bodyItemPrefab: Prefab, model: gc.BetHistory.BetDetailModel) {
        const { fractionalOddsFormat, betHistoryLog } = model;
        const { result, settlementResult, odds, freeBet, betLogDetails } = betHistoryLog;

        let rowIndex = 0;
        betLogDetails.forEach((betDetailsLog) => {
            // Create the original data structure
            const originalData: BetDetailLogItemType = { 
                betDetailsLog, 
                index: rowIndex, 
                odds, 
                settlementResult, 
                result, 
                freeBet, 
                fractionalOddsFormat 
            };

            // Split multi-bet logs into individual bet logs
            const splitLogs = RouletteBetDetailBodyItem.splitBetDetailLog(originalData);

            // Create a component for each individual bet
            splitLogs.forEach((splitData) => {
                splitData.index = rowIndex; // Update index for proper background coloring
                this.body.addChild(
                    this.buildBodyRow(bodyItemPrefab, splitData)
                );
                rowIndex++;
            });
        });
    }
} 