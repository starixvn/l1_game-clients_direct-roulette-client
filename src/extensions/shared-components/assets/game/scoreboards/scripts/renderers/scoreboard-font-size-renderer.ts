import { Label, UITransform, _decorator } from "cc";
import { ScoreboardItemRenderer } from "./scoreboard-item-renderer";

const { ccclass } = _decorator;

@ccclass
export class ScoreboardFontSizeRenderer extends ScoreboardItemRenderer {
    render() {
        if (!this.canRender()) {
            return;
        }

        super.render();

        const uiTransform = this.node.parent.getComponent(UITransform);
        const fontSize = (uiTransform.width / 1.3) >> 0;
        const label = this.node.getComponent(Label);

        label.fontSize = fontSize;
    }

    canRender() {
        return !!this.node.parent.getComponent(UITransform) && !!this.node.getComponent(Label);
    }
}
