import { _decorator, Color, Label } from "cc";
import { ScoreboardItemState } from "../../models/scoreboard-item-state";
import { ScoreboardItemRenderer } from "../../renderers/scoreboard-item-renderer";
const { ccclass, property } = _decorator;
@ccclass
export class BaccaratResultRenderer extends ScoreboardItemRenderer {
    render(state?: ScoreboardItemState, images?: any[], item?: any) {
        const data = state.data;
        if (!data) {
            return;
        }
        this.node.active =
            data[this.node.name] || (Array.isArray(data) && data.some((settlementResult) => settlementResult[this.node.name]));

        const label = this.node.getComponent(Label);
        if (label) {
            label.string = `${data["score"]}`;
            this.renderColorScore(data, label);
            this.node.active = true;
        }
    }

    reset(): void {
        this.node.active = false;
    }

    renderColorScore(data, label: Label) {
        if (!data || !label) {
            return;
        }

        switch (true) {
            case !!data.banker:
                label.color = new Color("FB0505");
                break;
            case !!data.player:
                label.color = new Color("0824F9");
                break;
            case !!data.tie:
                label.color = new Color("23ba00");
                break;
        }
    }
}
