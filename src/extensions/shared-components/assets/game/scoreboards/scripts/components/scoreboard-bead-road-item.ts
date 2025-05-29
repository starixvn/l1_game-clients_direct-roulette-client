import { Node, _decorator } from "cc";
import { GridItemSettings } from "../../../../shared/common-components/grid-layout/scripts/settings/grid-item-settings";
import { ScoreboardItemStatus } from "../models/scoreboard-item-enum";
import { ScoreboardItemState } from "../models/scoreboard-item-state";
import { ScoreboardDataConverter } from "./scoreboard-converter";
import { ScoreboardGridItem } from "./scoreboard-grid-item";

const { ccclass } = _decorator;

@ccclass
export class ScoreboardBeadRoadItem<T> extends ScoreboardGridItem<T> {
    createState(_: GridItemSettings, data?: T, container?: Node): ScoreboardItemState {
        const converter = container.getComponent(ScoreboardDataConverter);

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
            };
        }

        return {
            status: data[converter.keyOfA] ? ScoreboardItemStatus.A : ScoreboardItemStatus.B,
            tie: 0,
        };
    }
}
