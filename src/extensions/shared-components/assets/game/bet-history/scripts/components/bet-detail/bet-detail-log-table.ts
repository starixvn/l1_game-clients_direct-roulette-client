import gc from "@sg/game-client-base";
import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import { BaseBetDetailLogItem, BetDetailLogItemType } from "./bet-detail-log-item";

const { ccclass, property } = _decorator;

@ccclass()
export class BetDetailLogTable extends Component {
    @property(Node)
    body: Node = null;

    @property({ tooltip: "Multiple choices split by comma" })
    refundChoices = "";

    @property
    refundRatio = 0.5;

    lblRound: Label = null;

    getBetDetailItemComponent(node: Node) {
        return node.getComponent(BaseBetDetailLogItem);
    }

    buildBodyRow(bodyItemPrefab: Prefab, data: BetDetailLogItemType): Node {
        const bodyRow = instantiate(bodyItemPrefab);

        const logItem = this.getBetDetailItemComponent(bodyRow);
        if (logItem) {
            logItem.refundRatio = this.refundRatio;
            logItem.refundChoices = this.refundChoices.split(",");
            logItem.setData(data);
        }

        return bodyRow;
    }

    showBetDetail(bodyItemPrefab: Prefab, model: gc.BetHistory.BetDetailModel) {
        const { fractionalOddsFormat, betHistoryLog } = model;
        const { result, settlementResult, odds, freeBet, betLogDetails } = betHistoryLog;

        betLogDetails.forEach((betDetailsLog, index) => {
            this.body.addChild(
                this.buildBodyRow(bodyItemPrefab, { betDetailsLog, index, odds, settlementResult, result, freeBet, fractionalOddsFormat })
            );
        });
    }
}
