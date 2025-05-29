import { Node, _decorator } from "cc";
import { ScoreboardDataConverter } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-converter";
import { GridItemSettings } from "../../../../../../shared/common-components/grid-layout/scripts/settings/grid-item-settings";
import { BigRoadPoint } from "../../../helpers/scoreboard-big-road-helper";
import { ScoreboardItemState } from "../../../models/scoreboard-item-state";
import { ScoreboardBigRoadItem } from "../../scoreboard-big-road-item";

const { ccclass } = _decorator;

@ccclass
export class BaccaratBigRoadGridItem<T> extends ScoreboardBigRoadItem<T> {
    createState(_: GridItemSettings, point?: BigRoadPoint<T>, container?: Node): ScoreboardItemState {
        const converter = container.getComponent(ScoreboardDataConverter);

        return {
            status: this.getStatus(point, converter),
            tie: this.countTie(point, converter),
            data: point.data,
        };
    }
}
