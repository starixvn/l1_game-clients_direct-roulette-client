import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab } from "cc";
import { Dialog } from "db://shared-components/shared/common-components/dialogs/dialog";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetDetailLogTable } from "./bet-detail-log-table";
import { BaseBetDetailSummaryTable } from "./bet-detail-summary-table";
const { handle } = Observer;
const { ccclass, property } = _decorator;

export type BetDetailTableType = {
    model: gc.BetHistory.BetDetailModel;
    resultContentPrefab: Prefab;
    betDetailSummaryPrefab: Prefab;
    betDetailLogTablePrefab: Prefab;
    logDetailItemPrefab: Prefab;
};

@ccclass()
export class BetDetailTable extends ObserverComponent {
    @property(Node)
    nodeBetDetailSummaryTable: Node = null;

    @property(Node)
    nodeBetDetailLogTablePrefab: Node = null;

    showBetDetail(data: BetDetailTableType) {
        const { model, resultContentPrefab, betDetailSummaryPrefab, logDetailItemPrefab, betDetailLogTablePrefab } = data;

        const betDetailLogTable = instantiate(betDetailLogTablePrefab);
        betDetailLogTable.getComponent(BetDetailLogTable).showBetDetail(logDetailItemPrefab, model);
        this.nodeBetDetailLogTablePrefab.addChild(betDetailLogTable);

        const betDetailSummaryTable = instantiate(betDetailSummaryPrefab);
        betDetailSummaryTable?.getComponent(BaseBetDetailSummaryTable).renderResult(model, resultContentPrefab);
        this.nodeBetDetailSummaryTable?.addChild(betDetailSummaryTable);
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    onClickClose() {
        const dialogs = this.getComponentsInChildren(Dialog);

        if (dialogs.length > 0) {
            dialogs[0].hide();
        } else {
            this.node.destroy();
        }
    }
}
