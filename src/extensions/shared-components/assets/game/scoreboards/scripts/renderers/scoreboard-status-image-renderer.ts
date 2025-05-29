import { Sprite, _decorator } from "cc";
import { ScoreboardItemImage } from "../models/scoreboard-item-image";
import { ScoreboardItemState } from "../models/scoreboard-item-state";
import { ScoreboardItemRenderer } from "./scoreboard-item-renderer";

const { ccclass } = _decorator;

@ccclass
export class ScoreboardStatusImageRenderer extends ScoreboardItemRenderer {
    render(state: ScoreboardItemState, images: ScoreboardItemImage[]) {
        if (!this.canRender(state, images)) {
            return;
        }

        const sprite = this.node.getComponent(Sprite);

        sprite.spriteFrame = images[0].image;

        super.render();
    }

    canRender(state: ScoreboardItemState, images: ScoreboardItemImage[]) {
        return !!state && !!images.length && !!this.node.getComponent(Sprite);
    }
}
