import { Component, TweenEasing, Vec3, _decorator, tween } from "cc";
import { AnimationUtils } from "../../../../shared/utils";
const { ccclass, property } = _decorator;

@ccclass("HiddenPlayersBet")
export class HiddenPlayersBet extends Component {
    @property
    scaleOut = 1.05;

    protected scaleDefault = 1;
    protected durationAnimMove = 0.05;
    protected easingName: TweenEasing = "quintOut";
    protected isRunning = false;

    async animScaleOut() {
        this.isRunning && (await AnimationUtils.delayTime(this.durationAnimMove));

        tween(this.node)
            .call(() => {
                this.isRunning = true;
            })
            .to(
                this.durationAnimMove,
                {
                    scale: this.getScale(this.scaleOut),
                },
                { easing: this.easingName }
            )
            .to(
                this.durationAnimMove,
                {
                    scale: this.getScale(this.scaleDefault),
                },
                { easing: this.easingName }
            )
            .call(() => {
                this.isRunning = false;
            })

            .start();
    }

    protected getScale(scale: number) {
        return new Vec3(scale, scale, scale);
    }
}
