import { _decorator } from "cc";
import { ScoreboardBeadRoadAlgorithm } from "../../scoreboard-bead-road-algorithm";
import { ScoreboardKeepDetailConverter } from "../../scoreboard-keep-detail-converter";
import { BaccaratBeadRoadItem } from "./baccarat-bead-road-item";
import { ScoreboardBeadRoad } from "../../scoreboard-bead-road";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent([ScoreboardKeepDetailConverter, ScoreboardBeadRoadAlgorithm])
export class BaccaratBeadRoad extends ScoreboardBeadRoad {
    onChangeMode() {
        this.grid.scrollView.content.children.forEach((node) => {
            const item = node.getComponent(BaccaratBeadRoadItem);
            item.changeMode();
        });
    }
}
