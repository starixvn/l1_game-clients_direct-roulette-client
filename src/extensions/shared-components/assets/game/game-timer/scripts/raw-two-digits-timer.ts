import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node, tween, UIRenderer, v3 } from "cc";
import { AnimationUtils } from "../../../shared/utils";

const { Rounds } = gc;
const { ccclass, property } = _decorator;

@ccclass()
export default class RawTwoDigitsTimer extends Component {
    @property(Label)
    lblDigitFirst: Label = null;

    @property(Label)
    lblDigitSecond: Label = null;

    @property
    height = 0;

    @property
    bounceYOffest = 0;

    @property
    animated = true;

    protected readonly lockingColor: Color = Color.RED;
    protected readonly normalColor: Color = Color.WHITE;

    setTime(time: number) {
        const text = `${time}`.padStart(2, "0");
        const firstChar = text.slice(0, 1);
        const secondChar = text.slice(1, 2);

        if (this.lblDigitFirst.string !== firstChar) {
            this.handleBetTimeAnimation(this.lblDigitFirst.node);
        }

        if (this.lblDigitSecond.string !== secondChar) {
            this.handleBetTimeAnimation(this.lblDigitSecond.node);
        }

        this.lblDigitFirst.string = firstChar;
        this.lblDigitSecond.string = secondChar;
    }

    protected setColor(color: Color) {
        this.lblDigitFirst.getComponent(UIRenderer).color = color;
        this.lblDigitSecond.getComponent(UIRenderer).color = color;
    }

    protected handleBetTimeAnimation(node: Node) {
        if (this.animated) {
            node.position = v3(node.position.x, this.height);
            tween(node)
                .to(0.3, {
                    position: v3(node.position.x, -this.bounceYOffest),
                })
                .to(0.1, {
                    position: v3(node.position.x, 0),
                })
                .start();

            AnimationUtils.fadeIn(node, 0.2, 255);
        }
    }

    setState(state: string) {
        const color = state === Rounds.ROUND_STATE.LOCKING_BET ? this.lockingColor : this.normalColor;
        this.setColor(color);
    }
}
