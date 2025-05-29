import gc from "@sg/game-client-base";
import { Node, Prefab, _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../../shared/common-components/node-container/node-container";

import { InGameMenuEvents } from "../../../in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "../../../in-game-menu/scripts/stores/in-game-menu-store";
import { BetHistoryTable } from "./bet-history-table";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { BetHistory } = gc;

@ccclass("BetHistoryContainer")
export default class BetHistoryContainer extends NodeContainer {
    wrapperNode: Node = null;
    table: BetHistoryTable = null;

    @property(Prefab)
    headerPrefab: Prefab = null;

    @property(Prefab)
    bodyItemPrefab: Prefab = null;

    @property(Prefab)
    resultPrefab: Prefab = null;

    @handle(BetHistory.BetHistoryHandlers.BetHistoryCallServiceHandler, (handler) => handler.handle(1))
    hanldeShowBetHistory() {}

    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openBetHistory({ event }: { event: InGameMenuEvents }) {
        if (event === InGameMenuEvents.OPEN_HISTORY) {
            this.hanldeShowBetHistory();
        }
    }

    @render(BetHistory.BetHistoryStore, (store) => store.betHistoryModel, { fireImmediately: false })
    showBetHistory(betHistoryModel: gc.BetHistory.BetHistoryModel) {
        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
            this.table = this.wrapperNode.getComponent(BetHistoryTable);
        }

        this.table.showBetHistory({
            data: betHistoryModel,
            headerPrefab: this.headerPrefab,
            bodyItemPrefab: this.bodyItemPrefab,
            resultPrefab: this.resultPrefab,
        });
    }

    @render(gc.Dialogs.DialogsStore, (store) => store.forceClosed, { fireImmediately: false })
    popupVisibility(forceClosed: any) {
        forceClosed && this.wrapperNode?.destroy();
    }
}
