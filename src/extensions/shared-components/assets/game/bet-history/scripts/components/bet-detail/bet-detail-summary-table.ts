import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import { BaseResultBodyItem } from "../bet-history-body-item";

const { ccclass, property } = _decorator;

export class BaseBetDetailSummaryTable extends Component {
    renderResult(model: gc.BetHistory.BetDetailModel, resultPrefab: Prefab | null) {}
}

@ccclass()
export class BetDetailSummaryTable extends BaseBetDetailSummaryTable {
    @property(Node)
    result: Node = null;

    @property(Label)
    lblRound: Label = null;

    renderResult(model: gc.BetHistory.BetDetailModel, resultPrefab: Prefab | null) {
        const { result, settlementResult, roundId } = model.betHistoryLog;

        this.lblRound.string = roundId.toString();

        if (resultPrefab) {
            const bodyRow = instantiate(resultPrefab);
            bodyRow.getComponent(BaseResultBodyItem)?.setData(result, settlementResult);
            this.result.addChild(bodyRow);
        }
    }
}
