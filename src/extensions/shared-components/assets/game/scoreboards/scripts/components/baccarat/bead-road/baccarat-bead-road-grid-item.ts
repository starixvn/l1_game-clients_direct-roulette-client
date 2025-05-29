import { Node, _decorator } from "cc";
import { ScoreboardBeadRoadItem } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-bead-road-item";
import { ScoreboardDataConverter } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-converter";
import { GridItemSettings } from "../../../../../../shared/common-components/grid-layout/scripts/settings/grid-item-settings";
import { ScoreboardItemStatus } from "../../../models/scoreboard-item-enum";
import { ScoreboardItemState } from "../../../models/scoreboard-item-state";

const { ccclass } = _decorator;

@ccclass
export class BaccaratBeadRoadGridItem<T> extends ScoreboardBeadRoadItem<T> {
    createState(_: GridItemSettings, data?: T, container?: Node): ScoreboardItemState {
        const converter = container.getComponent(ScoreboardDataConverter);
        const dataResult = data["result"];
        if (data[converter.blinkKey]) {
            return {
                status: ScoreboardItemStatus.BLINK,
                tie: 0,
            };
        }

        if (data[converter.keyOfA] === undefined) {
            return {
                status: ScoreboardItemStatus.NONE,
                tie: 0,
            };
        }

        if (data[converter.tieKey]) {
            return {
                status: ScoreboardItemStatus.NONE,
                tie: 1,
                data: {
                    ...data,
                    score: this.calculateResult(container, dataResult, converter.tieKey, false),
                },
            };
        }

        return {
            status: data[converter.keyOfA] ? ScoreboardItemStatus.A : ScoreboardItemStatus.B,
            tie: 0,
            data: {
                ...data,
                score: this.calculateResult(container, dataResult, converter.keyOfA, data[converter.keyOfA]),
            },
        };
    }

    protected calculateResult(container: Node, dataResult: any, key: string, isWin: boolean): any {
        const converter = container.getComponent(ScoreboardDataConverter);
        const keys = Object.keys(dataResult);

        const selectKey = key === converter.tieKey ? keys[0] : isWin ? key : keys.find((k) => k !== key);
        const hand = dataResult[selectKey];
        return this.calculateResultOnHand(hand);
    }

    protected calculateResultOnHand(hand: { card1: any; card2: any; card3: any }) {
        let value = 0;
        value += this.getValueCard(hand.card1);
        value += this.getValueCard(hand.card2);
        value += this.getValueCard(hand.card3);
        return (value % 10).toString();
    }

    private getValueCard(card: { rank: number }) {
        if (!card) {
            return 0;
        }
        const value = card?.rank + 1;
        return value > 10 || !value ? 0 : value;
    }
}
