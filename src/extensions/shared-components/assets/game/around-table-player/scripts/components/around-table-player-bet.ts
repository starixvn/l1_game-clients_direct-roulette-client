import { Component, TweenEasing, _decorator, math, tween, v3 } from "cc";
import { AnimationUtils } from "../../../../shared/utils";
const { ccclass, property } = _decorator;

@ccclass("AroundTablePlayerBet")
export class AroundTablePlayerBet extends Component {
    @property
    direction = 1;

    @property
    isXAxis = true;

    @property
    stepMove = 5;

    protected durationAnimMove = 0.15;
    protected easingName: TweenEasing = "quintOut";
    protected originalPosition: math.Vec3 = null;
    protected isRunning = false;

    protected onLoad(): void {
        this.originalPosition = v3(this.node.position.x, this.node.position.y, this.node.position.z);
    }

    async animMoveBet() {
        this.isRunning && (await AnimationUtils.delayTime(this.durationAnimMove));
        tween(this.node)
            .call(() => {
                this.isRunning = true;
            })
            .to(
                this.durationAnimMove,
                {
                    position: this.getPosition(),
                },
                { easing: this.easingName }
            )
            .to(
                this.durationAnimMove,
                {
                    position: v3(this.originalPosition.x, this.originalPosition.y, 0),
                },
                { easing: this.easingName }
            )
            .call(() => {
                this.isRunning = false;
            })

            .start();
    }

    protected getPosition() {
        let x = this.originalPosition.x;
        let y = this.originalPosition.y;
        if (this.isXAxis) {
            x += this.stepMove * this.direction;
        } else {
            y += this.stepMove * this.direction;
        }

        return v3(x, y, 0);
    }
}
