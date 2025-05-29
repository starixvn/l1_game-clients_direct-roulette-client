import { _decorator, sp } from "cc";
import { AnimationUtils } from "../../../shared/utils/utils";
import { PokerCard } from "./poker-card";
const { ccclass, property } = _decorator;

enum AnimationName {
    OpenCard = "open-card",
    CloseCard = "close-card",
    LuckyCard = "lucky-card",
    BackCard = "default-back",
    FrontCard = "default-front",
    FrontCardGold = "default-front-gold",
}

@ccclass
export class PokerCardSpine extends PokerCard {
    @property(sp.Skeleton)
    skeletonCard: sp.Skeleton = null;

    protected onLoad(): void {
        this.setWinHighlight(false);
    }

    async setGoldenCard(show: boolean, animated: boolean) {
        if (!this.bgGolden) {
            return;
        }

        if (animated) {
            show && (await AnimationUtils.playSpine(this?.skeletonCard, AnimationName.LuckyCard, false));
        } else {
            await AnimationUtils.playSpine(this?.skeletonCard, AnimationName.FrontCardGold, false);
        }
    }

    dropCard(duration: number) {
        return AnimationUtils.playSpine(this?.skeletonCard, AnimationName.CloseCard, false, duration);
    }

    async openCard(animated = true, duration?: number) {
        this.changeCardFace(true);
        if (animated) {
            await AnimationUtils.playSpine(this?.skeletonCard, AnimationName.OpenCard, false, duration);
        } else {
            this.faceUp();
        }
    }

    async closeCard(duration: number) {
        this.setWinHighlight(false);
        await AnimationUtils.playSpine(this?.skeletonCard, AnimationName.CloseCard, false, duration);
    }

    async closeAfterDrop(duration: number) {}

    faceUp() {
        AnimationUtils.playSpine(this?.skeletonCard, AnimationName.FrontCard, false);
    }

    faceDown() {
        super.faceDown();
        AnimationUtils.playSpine(this?.skeletonCard, AnimationName.BackCard, false);
    }

    protected override setDetailVisibility(active: boolean) {}

    protected override async showCardBack() {
        AnimationUtils.playSpine(this?.skeletonCard, AnimationName.BackCard, false);
    }
}
