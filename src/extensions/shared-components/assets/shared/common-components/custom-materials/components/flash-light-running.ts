import { Enum, UITransform, _decorator, tween } from "cc";
import { FlashLightBase } from "./flash-light-base";
const { ccclass, property } = _decorator;

enum Direction {
    Horizontal,
    Vertical,
}

@ccclass("FlashLightRunning")
export class FlashLightRunning extends FlashLightBase {
    @property({ type: Enum(Direction) })
    direction = Direction.Horizontal;

    @property
    speed = 240;

    initStart() {
        const uiTransform = this.getComponent(UITransform);
        const isHorizontal = this.direction === Direction.Horizontal;
        const distance = isHorizontal ? uiTransform.width : uiTransform.height;
        const data = {
            value: 0,
        };

        const updateValue = (value) => {
            if (!this.controller) {
                return;
            }
            if (isHorizontal) {
                this.controller.lightCenterPoint.x = value;
            } else {
                this.controller.lightCenterPoint.y = value;
            }
            this.controller.updateController();
        };

        const duration = distance / this.speed;
        tween(data)
            .call(() => {
                data.value = 0;
                updateValue(0);
            })
            .to(
                duration,
                { value: 1 },
                {
                    onUpdate: (target: { value }) => {
                        updateValue(target.value);
                    },
                }
            )
            .delay(0.5)
            .union()
            .repeatForever()
            .start();
    }
}
