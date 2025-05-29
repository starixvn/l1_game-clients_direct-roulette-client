import gc from "@sg/game-client-base";
import { _decorator, Color, Label, Node, tween, UIOpacity, UIRenderer, v3 } from "cc";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

const { Rounds } = gc;
const { ccclass, property } = _decorator;

@ccclass()
export default class TwoDigitsTimer extends ObserverComponent {
    @property(Label)
    lblDigitFirst: Label = null;

    @property(Label)
    lblDigitSecond: Label = null;

    @property
    heightOffset = 0;

    @property
    animated = true;

    @property(Color)
    lockingColor: Color = new Color(255, 0, 0, 255);

    protected normalColor: Color = Color.WHITE;

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
            node.position = v3(node.position.x, this.heightOffset);
            tween(node)
                .to(0.3, {
                    position: v3(node.position.x, -5),
                })
                .to(0.1, {
                    position: v3(node.position.x, 0),
                })
                .start();
            const uiOpacity = node.getComponent(UIOpacity);
            uiOpacity.opacity = 1;
            tween(uiOpacity).to(0.2, { opacity: 255 }).start();
        }
    }

    setState(state: string) {
        const color = state === Rounds.ROUND_STATE.LOCKING_BET ? new Color(this.lockingColor) : this.normalColor;
        this.setColor(color);
    }
}
