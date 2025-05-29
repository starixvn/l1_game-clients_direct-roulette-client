import { _decorator } from "cc";
import { AnimationUtils } from "../../../utils/utils";
import { DialogTransition } from "./dialog-transition";

const { bounceIn, bounceOut, fadeIn, fadeOut, stopFade } = AnimationUtils;
const { ccclass, property } = _decorator;

@ccclass("FadeDialogTransition")
export class FadeDialogTransition extends DialogTransition {
    @property({ override: true })
    appearDuration = 0.3;

    show(animated: boolean) {
        stopFade(this.node);

        if (!animated) {
            AnimationUtils.setOpacityNode(this.node, 255);
            return;
        }

        return [fadeIn(this.node, this.appearDuration)];
    }

    async hide(animated: boolean) {
        stopFade(this.node);
        await fadeOut(this.node, this.appearDuration);
    }
}
