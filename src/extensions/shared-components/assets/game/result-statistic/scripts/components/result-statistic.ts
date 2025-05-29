import gc from "@sg/game-client-base";
import Observer from "observer";
import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { ResultStatisticItemProperty } from "../models/result-statistic-item-property";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("ResultStatistic")
export class ResultStatistic extends ObserverComponent {
    @property([ResultStatisticItemProperty])
    statisticItems: ResultStatisticItemProperty[] = [];

    @property
    supportStatisticKeys = "result.dice1,result.dice2,result.dice3";

    get statisticKeys() {
        return this.supportStatisticKeys?.split(",");
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    render(histories: gc.RoundHistories.RoundHistory[]) {
        if (histories?.length === 0) {
            return;
        }
        const statistic = this.generateStatisticalData(histories);
        this.setData(statistic);
    }

    private getResultValue(key: string, history: gc.RoundHistories.RoundHistory) {
        return key
            .split(".")
            .reduce((r, k) => r[k], { ...history })
            ?.toString();
    }

    protected generateStatisticalData(histories: gc.RoundHistories.RoundHistory[]) {
        return histories.reduce((result, history) => {
            this.statisticKeys?.forEach((key) => {
                const name = this.getResultValue(key, history);
                result[name] = (result[name] || 0) + 1;
            });
            return result;
        }, {});
    }

    protected setData(statistic: Object) {
        this.statisticItems?.forEach((item) => {
            item.label && (item.label.string = (statistic[item.value] || 0).toString());
        });
    }
}
