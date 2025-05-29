import { Node, _decorator } from "cc";
import { GridItemSettings } from "../../../../shared/common-components/grid-layout/scripts/settings/grid-item-settings";
import { BigRoadPoint } from "../helpers/scoreboard-big-road-helper";
import { ScoreboardItemStatus } from "../models/scoreboard-item-enum";
import { ScoreboardItemState } from "../models/scoreboard-item-state";
import { ScoreboardDataConverter } from "./scoreboard-converter";
import { ScoreboardGridItem } from "./scoreboard-grid-item";

const { ccclass } = _decorator;

@ccclass
export class ScoreboardBigRoadItem<T> extends ScoreboardGridItem<BigRoadPoint<T>> {
    createState(_: GridItemSettings, data?: BigRoadPoint<T>, container?: Node): ScoreboardItemState {
        const converter = container.getComponent(ScoreboardDataConverter);

        return {
            status: this.getStatus(data, converter),
            tie: this.countTie(data, converter),
        };
    }

    protected getStatus(data: BigRoadPoint<T>, converter: ScoreboardDataConverter): ScoreboardItemStatus {
        if (this.hasBlinkNode(data, converter)) {
            return ScoreboardItemStatus.BLINK;
        }

        if (data.status === undefined || this.firstRoundHasTie(data, converter)) {
            return ScoreboardItemStatus.NONE;
        }

        return data.status ? ScoreboardItemStatus.A : ScoreboardItemStatus.B;
    }

    protected countTie(point: BigRoadPoint<T>, converter: ScoreboardDataConverter): number {
        if (!point?.data) {
            return 0;
        }
        const count = this.firstRoundHasTie(point, converter) ? point.data.length : point.data.length - 1;

        return Math.max(0, count);
    }

    protected firstRoundHasTie(point: BigRoadPoint<T>, converter: ScoreboardDataConverter): boolean {
        if (point?.data?.length) {
            return point?.data[0][converter.tieKey];
        }

        return false;
    }

    protected hasBlinkNode(point: BigRoadPoint<T>, converter: ScoreboardDataConverter): boolean {
        return point?.data?.map((data) => data[converter.blinkKey]).includes(true);
    }
}
