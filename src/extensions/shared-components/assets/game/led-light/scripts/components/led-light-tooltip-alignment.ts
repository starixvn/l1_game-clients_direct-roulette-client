import { _decorator, Node, UITransform, v3 } from "cc";

import { LedLightTooltip, TipAlignment } from "./led-light-tooltip";

const { ccclass, property } = _decorator;

@ccclass("LedLightTooltipAlignment")
export class LedLightTooltipAlignment extends LedLightTooltip {
    @property(Node)
    background: Node = null;

    @property
    offsetAlignment = 0.2;

    public setAlignment(alignment: TipAlignment) {
        if (!this.background) {
            return;
        }

        const pos = this.background.position;
        const width = this.background.getComponent(UITransform).width;
        const dict = [-0.5 + this.offsetAlignment, 0, 0.5 - this.offsetAlignment];
        const posX = width * dict[alignment];
        this.background.position = v3(posX, pos.y, pos.z);
    }
}
