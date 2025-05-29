import gc from "@sg/game-client-base";
import { Component, Label, TweenEasing, UIOpacity, _decorator, tween, v3 } from "cc";
const { ccclass, property } = _decorator;
const { Translator } = gc;

@ccclass
export default class PromptMessageComponent extends Component {
    @property({ type: Label })
    resultText: Label = null;

    protected durationShow = 1.5;
    protected durationAnimOpacity = 0.3;
    protected durationAnimMove = 0.4;
    protected easingStart: TweenEasing = "sineOut";
    protected easingEnd: TweenEasing = "sineIn";

    start() {
        this.node.getComponent(UIOpacity).opacity = 0;
    }

    set content(value: string) {
        this.show(value);
    }

    protected show(text: string) {
        this.resultText.string = text;
        this.prompt();
    }

    prompt() {
        const opacity = this.node.getComponent(UIOpacity);
        opacity.opacity = 1;
        const clonePositionX = this.node.position.x;

        tween(opacity)
            .to(this.durationAnimOpacity, { opacity: 255 }, { easing: this.easingStart })
            .delay(this.durationShow - this.durationAnimOpacity * 2)
            .to(this.durationAnimOpacity, { opacity: 0 }, { easing: this.easingStart })
            .start();

        tween(this.node)
            .to(
                this.durationAnimMove,
                {
                    position: v3(0, 0, 0),
                },
                { easing: this.easingStart }
            )
            .delay(this.durationShow - this.durationAnimMove * 2)
            .to(
                this.durationAnimMove,
                {
                    position: v3(Math.abs(clonePositionX), 0, 0),
                },
                { easing: this.easingStart }
            )
            .delay(0.2)
            .to(0.1, {
                position: v3(clonePositionX, 0, 0),
            })
            .start();
    }

    showStartBetMessage() {
        const message = Translator.commonTranslate("message_place_bets").toUpperCase();
        this.content = message;
    }

    showStopBetMessage() {
        const message = Translator.commonTranslate("message_stop_bet").toUpperCase();
        this.content = message;
    }
}
