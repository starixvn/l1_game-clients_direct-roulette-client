import gc from "@sg/game-client-base";
import { _decorator, Node, Prefab } from "cc";
import Observer from "observer";

import { NodeContainer } from "../../../../../shared/common-components/node-container/node-container";
import { BetDetailTable } from "./bet-detail-table";

const { ccclass, property } = _decorator;
const { render } = Observer;
const { BetHistory } = gc;

@ccclass("BetDetailContainer")
export class BetDetailContainer extends NodeContainer {
    @property(Prefab)
    betdetailSummaryTablePrefab: Prefab = null;

    @property(Prefab)
    resultContentPrefab: Prefab = null;

    @property(Prefab)
    betDetailLogTablePrefab: Prefab = null;

    wrapperNode: Node = null;
    table: BetDetailTable = null;

    @property(Prefab)
    logDetailItemPrefab: Prefab = null;

    @render(BetHistory.BetDetailHistoryStore, (store) => store.model, { fireImmediately: false })
    showBetDetailPopup(model: gc.BetHistory.BetDetailModel) {
        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
            this.table = this.wrapperNode.getComponent(BetDetailTable);
        }

        this.table.showBetDetail({
            model,
            resultContentPrefab: this.resultContentPrefab,
            betDetailSummaryPrefab: this.betdetailSummaryTablePrefab,
            betDetailLogTablePrefab: this.betDetailLogTablePrefab,
            logDetailItemPrefab: this.logDetailItemPrefab,
        });
    }
}
