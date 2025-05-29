import { _decorator, Component } from "cc";
import { AnimationUtils } from "../../../utils/utils";

const { bounceIn, bounceOut, fadeIn, fadeOut, stopFade } = AnimationUtils;
const { ccclass, property } = _decorator;

@ccclass("DialogTransition")
export class DialogTransition extends Component {
    @property
    appearDuration = 0.4;

    show(animated: boolean) {
        stopFade(this.node);

        if (!animated) {
            AnimationUtils.setOpacityNode(this.node, 255);
            return;
        }

        return [fadeIn(this.node, 0.3), bounceIn(this.node, this.node.scale, this.appearDuration)];
    }

    async hide(animated: boolean) {
        stopFade(this.node);
        fadeOut(this.node, this.appearDuration);
        await bounceOut(this.node, this.appearDuration);
    }
}
