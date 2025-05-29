import gc from "@sg/game-client-base";
import { _decorator, Node, Prefab, ScrollView, instantiate } from 'cc';
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer"
import { SevenUpDownRoundResultItem } from "./seven-up-down-round-result-item";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass('SevenUpDownRoundHistory')
export class SevenUpDownRoundHistory extends ObserverComponent {
    @property(Prefab)
    roundResultPrefab: Prefab = null;

    @property(Node)
    content: Node = null;

    @property(Node)
    dicesScrollView: Node = null;

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    updateData(dataLogs: any[]) {
        this.updateRoundResult(dataLogs);
        this.dicesScrollView.getComponent(ScrollView).scrollToRight();
    }

    updateRoundResult(dataLogs: any[]) {
        this.content.destroyAllChildren();

        for (let i = 0; i < dataLogs.length; i++) {
            const dataLog = dataLogs[i];
            const roundResultNode = instantiate(this.roundResultPrefab);
            const roundResultComponent = roundResultNode.getComponent(SevenUpDownRoundResultItem);
            roundResultComponent.setData(dataLog);
            roundResultComponent.highlight.active = i === 0;
            this.content.addChild(roundResultNode);
        }
    }
}


