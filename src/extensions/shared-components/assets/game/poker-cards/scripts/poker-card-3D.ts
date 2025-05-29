import { _decorator, v3 } from "cc";
import { AnimationUtils } from "../../../shared/utils/utils";
import { PokerCard } from "./poker-card";
const { ccclass } = _decorator;

enum AnimationName {
    Open_Card = "open-card",
    New_Card = "new-card",
    Lucky_Card = "lucky-card",
    Close_Card = "close-card",
}

@ccclass
export class PokerCard3D extends PokerCard {
    protected onLoad(): void {
        this.setWinHighlight(false);
        this.node.position = v3(this.node.position.x, this.node.position.y, 100);
    }

    async setGoldenCard(show: boolean, animated: boolean) {
        if (!this.bgGolden) {
            return;
        }

        if (animated) {
            show && (await AnimationUtils.playAnimation(this.animation, AnimationName.Lucky_Card));
        } else {
            AnimationUtils.setOpacityNode(this.bgGolden, show ? 255 : 1);
        }
    }

    dropCard(duration: number) {
        return AnimationUtils.playAnimation(this.animation, AnimationName.Close_Card, duration);
    }

    async openCard(animated = true, duration?: number) {
        this.changeCardFace(true);
        if (animated) {
            await AnimationUtils.playAnimation(this.animation, AnimationName.Open_Card, duration);
        } else {
            this.faceUp();
        }
    }

    async closeCard(duration: number) {
        this.setWinHighlight(false);
        await AnimationUtils.playAnimation(this.animation, AnimationName.Close_Card, duration);
    }

    async closeAfterDrop(duration: number) {}

    faceUp() {
        AnimationUtils.setOpacityNode(this.bgBackCard, 1);
        AnimationUtils.setOpacityNode(this.bgWhiteCard, 255);
    }

    protected override setDetailVisibility(active: boolean) {}

    protected override async showCardBack() {
        this.resetDefaultCardBack();
        super.showCardBack();
    }

    protected resetDefaultCardBack() {
        // Node using in anim files
        AnimationUtils.setOpacityNode(this.bgBackCard, 255);
        AnimationUtils.setOpacityNode(this.bgWhiteCard, 1);
        this.bgWhiteCard.eulerAngles = v3(0, 0, 0);
        this.bgWhiteCard.scale = v3(1, 1, 1);
        this.bgBackCard.eulerAngles = v3(0, 0, 0);
        this.bgBackCard.scale = v3(1, 1, 1);
        this.bgWhiteCard.parent.eulerAngles = v3(0, 0, 0);
        this.bgWhiteCard.parent.scale = v3(1, 1, 1);
    }
}
