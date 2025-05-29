import { _decorator } from "cc";
import { ScoreboardItemRenderer } from "../../../renderers/scoreboard-item-renderer";
import { ScoreboardItem } from "../../scoreboard-item";
import { BaccaratResultRenderer } from "../baccarat-result-renderer";

const { ccclass, property } = _decorator;

@ccclass
export class BaccaratBigRoadItem extends ScoreboardItem {
    protected executeRender(renderer: ScoreboardItemRenderer) {
        super.executeRender(renderer);

        const resultRenderer = renderer.getComponent(BaccaratResultRenderer);
        if (resultRenderer) {
            resultRenderer.render(this.state, null, this);
        }
    }
}
