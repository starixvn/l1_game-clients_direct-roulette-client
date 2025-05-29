import { Node, _decorator } from "cc";
import { DerivedScoreboardPoint } from "sc-scoreboards";
import { GridItemSettings } from "../../../../shared/common-components/grid-layout/scripts/settings/grid-item-settings";
import { ScoreboardItemStatus } from "../models/scoreboard-item-enum";
import { ScoreboardItemState } from "../models/scoreboard-item-state";
import { ScoreboardGridItem } from "./scoreboard-grid-item";

const { ccclass } = _decorator;

@ccclass
export class ScoreboardDerivedItem<T> extends ScoreboardGridItem<DerivedScoreboardPoint> {
    createState(_: GridItemSettings, point?: DerivedScoreboardPoint, container?: Node): ScoreboardItemState {
        return {
            status: this.getStatus(point),
            tie: 0,
        };
    }

    protected getStatus(point: DerivedScoreboardPoint): ScoreboardItemStatus {
        if (this.hasBlinkNode(point)) {
            return ScoreboardItemStatus.BLINK;
        }

        if (point.status === undefined) {
            return ScoreboardItemStatus.NONE;
        }

        return point.status ? ScoreboardItemStatus.A : ScoreboardItemStatus.B;
    }

    protected hasBlinkNode(point: DerivedScoreboardPoint): boolean {
        return !!point?.isBlink;
    }
}
