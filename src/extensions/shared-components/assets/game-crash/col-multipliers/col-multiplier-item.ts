import gc from "@sg/game-client-base";
import { _decorator, Component, Label, v3 } from "cc";
const { FormatUtils } = gc;
const { ccclass, property } = _decorator;

@ccclass("col_multiplier_item")
export class ColMultiplierItem extends Component {
    @property(Label)
    lblMultiplier: Label = null;

    setMultiplier(value: number) {
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(value, 2, false)}x`;
    }

    setPositionForMultiplier1() {
        this.lblMultiplier.node.position = v3(35, 6, 0);
    }
}
