import gc from "@sg/game-client-base";
import { _decorator, Label } from 'cc';
import { ObserverComponent } from 'db://shared-components/shared/common-components/observer-component/scripts/observer-component';
import Observer from "observer";

const { ccclass, property } = _decorator;
const { render } = Observer;
export enum GameBetType {
    up = "up",
    down = "down",
    seven = "seven"
}

@ccclass('SevenUpDownResultPercentage')
export class SevenUpDownResultPercentage extends ObserverComponent {
    @property(Label)
    lblUp: Label = null;

    @property(Label)
    lblDown: Label = null;

    @property(Label)
    lblSeven: Label = null;

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    renderResultPercentage(dataLogs: any[]) {
        this.calculatePercentagesMainChoice(dataLogs);
    }

    calculatePercentagesMainChoice(dataLogs: any[]) {
        if (dataLogs.length > 0) {
            let upTotal = 0,
                downTotal = 0,
                sevenTotal = 0;

            dataLogs.forEach((log) => {
                const { settlementResult } = log;

                upTotal += settlementResult[GameBetType.up] ? 1 : 0;
                downTotal += settlementResult[GameBetType.down] ? 1 : 0;
                sevenTotal += settlementResult[GameBetType.seven] ? 1 : 0;
            });

            const length = dataLogs.length;

            const upPercentage = Math.round((upTotal / length) * 100);
            const downPercentage = Math.round((downTotal / length) * 100);
            const sevenPercentage = Math.round((sevenTotal / length) * 100);

            this.lblUp.string = `${upPercentage}%`;
            this.lblDown.string = `${downPercentage}%`;
            this.lblSeven.string = `${sevenPercentage}%`;
        }
    }
}

