import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { RoundHistoryItem } from "./round-history-item";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class StatisticsBar extends ObserverComponent {
    @property(Prefab)
    prbStatisticsItem: Prefab = null;

    @property(Node)
    content: Node = null;

    @property
    prefixName = "statistics-bar";
    private numberOfRoundHistory = 0;

    @render(gc.GameConfigs.GameSetting, (setting) => setting.numberOfRoundHistory)
    renderNumberOfRoundHistory(numberOfRoundHistory: number) {
        this.numberOfRoundHistory = numberOfRoundHistory;
    }

    @render(gc.GameCrash.RoundHistory.CrashRoundHistoryStore, (store) => store.roundHistories, { fireImmediately: false })
    setRoundsInfo(rounds: gc.RoundHistories.RoundHistory[]) {
        this.updateStatisticsBarInfo(rounds);
    }

    private updateStatisticsBarInfo(rounds: gc.RoundHistories.RoundHistory[]) {
        this.content.destroyAllChildren();
        rounds.forEach((round, index) => {
            if (index > this.numberOfRoundHistory) {
                return;
            }
            const node = instantiate(this.prbStatisticsItem);
            const control = node.getComponent(RoundHistoryItem);
            control.roundInfo = round;
            control.hideAllNodes();
            control.setPrefixFrame(this.prefixName);
            if (control.isCrashed()) {
                control.updateMultiplierValue(+round.result);
            }
            this.content.addChild(node);
        });
    }
}
