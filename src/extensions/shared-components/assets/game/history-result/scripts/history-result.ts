import gc from "@sg/game-client-base";
import Observer from "observer";
import { _decorator, instantiate, CCInteger, Node, Prefab, ScrollView } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { HistoryResultItem } from "./history-result-item";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("HistoryResult")
export class HistoryResult extends ObserverComponent {
    @property(Node)
    containerItem: Node = null;

    @property(Prefab)
    prbHistoryResultItem: Prefab = null;

    @property(CCInteger)
    minColumns = 10;

    protected historyResultItems: HistoryResultItem[] = [];
    protected rounds: gc.RoundHistories.RoundHistory[] = [];

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    public setHistoryResultInfo(rounds: gc.RoundHistories.RoundHistory[]) {
        this.rounds = [...rounds];
        if (this.rounds.length === 0) {
            return;
        }
        while (this.rounds.length < this.minColumns) {
            this.rounds.push(null);
        }

        this.removeAllItems();
        this.createItems();
        this.historyResultItems[0]?.highlight();
        this.historyResultItems[0]?.setEndGrid();
        setTimeout(() => {
            this.node.getComponentInChildren(ScrollView)?.scrollToRight(0.5);
        }, 0);
    }

    private removeAllItems() {
        this.containerItem.destroyAllChildren();
        this.historyResultItems = [];
    }

    private createItems() {
        this.rounds.forEach((round) => {
            const itemNode = instantiate(this.prbHistoryResultItem);
            const historyResultItem = itemNode?.getComponent(HistoryResultItem) ?? itemNode?.getComponentInChildren(HistoryResultItem);
            historyResultItem?.setData(round);
            this.historyResultItems.push(historyResultItem);
            this.containerItem.addChild(itemNode);
        });
    }
}
