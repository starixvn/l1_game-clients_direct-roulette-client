import { Label, _decorator } from "cc";
import { ScoreboardItemState } from "../models/scoreboard-item-state";
import { ScoreboardItemRenderer } from "./scoreboard-item-renderer";

const { ccclass } = _decorator;

@ccclass
export class ScoreboardTieValueRenderer extends ScoreboardItemRenderer {
    render(state: ScoreboardItemState) {
        if (!this.canRender(state)) {
            return;
        }

        const label = this.node.getComponent(Label);

        label.string = `${state.tie}`;

        super.render();
    }

    reset(): void {
        super.reset();

        const label = this.node.getComponent(Label);

        label.string = "";
    }

    canRender(state: ScoreboardItemState) {
        return !!state && state.tie > 1;
    }
}
