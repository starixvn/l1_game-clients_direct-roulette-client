import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";

import { ComponentUtils } from "../../../../shared/utils";

const { ccclass, property } = _decorator;

export enum TipAlignment {
    Left,
    Cennter,
    Right,
}
@ccclass("LedLightTooltip")
export class LedLightTooltip extends Component {
    @property(Label)
    result: Label = null;

    @property(Label)
    roundId: Label = null;

    protected onLoad(): void {
        ComponentUtils.setEmptyLabels([this.roundId]);
    }

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        // handle
    }

    public showTooltip(show = true) {
        this.node.active = show;
    }

    public setAlignment(alignment: TipAlignment) {}
}
