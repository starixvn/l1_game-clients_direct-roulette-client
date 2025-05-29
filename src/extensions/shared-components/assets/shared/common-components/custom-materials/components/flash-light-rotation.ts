import { _decorator, tween } from "cc";
import { FlashLightBase } from "./flash-light-base";
const { ccclass, property } = _decorator;

@ccclass
export class FlashLightRotation extends FlashLightBase {
    @property
    degreePerSecond = 360;

    @property
    clockwise = true;

    initStart() {
        const data = {
            angle: 0,
        };
        const angle = this.clockwise ? -this.degreePerSecond : this.degreePerSecond;
        tween(data)
            .by(
                1,
                { angle },
                {
                    onUpdate: (target: { angle }) => {
                        if (!this.controller) {
                            return;
                        }
                        this.controller.lightAngle = target.angle;
                        this.controller.updateController();
                    },
                }
            )
            .repeatForever()
            .start();
    }
}
