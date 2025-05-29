import { Node, _decorator } from "cc";
import { ScoreboardItemRenderer } from "../../../renderers/scoreboard-item-renderer";
import { ScoreboardItem } from "../../scoreboard-item";
import { BaccaratResultRenderer } from "../baccarat-result-renderer";

const { ccclass, property } = _decorator;

@ccclass
export class BaccaratBeadRoadItem extends ScoreboardItem {
    @property({ type: Node })
    statusNodes: Node[] = [];

    showDetail = false;

    onLoad() {
        this.updateStatusNodesVisibility();
    }

    changeMode() {
        this.showDetail = !this.showDetail;

        this.updateStatusNodesVisibility();
        this.render();
    }

    private updateStatusNodesVisibility() {
        this.statusNodes[0].active = !this.showDetail;
        this.statusNodes[1].active = this.showDetail;
    }

    protected executeRender(renderer: ScoreboardItemRenderer) {
        super.executeRender(renderer);

        const resultRenderer = renderer.getComponent(BaccaratResultRenderer);
        if (resultRenderer) {
            resultRenderer.render(this.state, null, this);
        }
    }
}
