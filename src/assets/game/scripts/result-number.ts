import { _decorator, Color, Component, Label, Node, Sprite } from "cc";
import RouletteUtils from "./roulette-utils";
const { ccclass, property } = _decorator;

@ccclass
export class ResultNumber extends Component {
    @property(Sprite)
    background: Sprite = null;

    @property(Label)
    label: Label = null;

    setNumber(number: number) {
        this.label.string = number.toString();
        const color = Color.BLACK;
        this.background.color = number === 0 ? color.fromHEX("#145c1c") : RouletteUtils.isRed(number) ? color.fromHEX("#b80201") : color;
        this.show();
    }

    show() {
        this.node.active = true;
    }

    hide() {
        this.node.active = false;
    }
}
