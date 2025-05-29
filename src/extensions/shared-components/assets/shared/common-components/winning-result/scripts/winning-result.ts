import gc from "@sg/game-client-base";
import { _decorator, Component, Label, tween, v3 } from "cc";
import { AnimationUtils } from "../../../utils";
const { ccclass, property } = _decorator;

@ccclass("winning_result")
export class WinningResult extends Component {
    @property(Label)
    label: Label = null;

    @property
    supportChoices = "";

    @property
    upperCaseChoice = false;

    private get choices() {
        return this.supportChoices.split(",");
    }

    show(duration = 0.3) {
        const offsetMoving = 50;
        this.node.position = v3(this.node.position.x, this.node.position.y - offsetMoving);
        this.node.active = true;
        AnimationUtils.fadeIn(this.node, 0.4 * duration);
        return new Promise((resolve) => {
            tween(this.node)
                .by(
                    duration,
                    {
                        position: v3(0, offsetMoving),
                    },
                    { easing: "sineOut" }
                )
                .call(resolve)
                .start();
        });
    }

    async hide(duration = 0.3) {
        await AnimationUtils.fadeOut(this.node, duration);
        this.hideQuickly();
    }

    hideQuickly() {
        this.node.active = false;
    }

    showQuickly() {
        this.node.active = true;
    }

    setResult(data: gc.GameServiceMessage.TResult) {}

    setSettlementResult(data: gc.GameServiceMessage.TSettlementResult) {
        const winChoice = this.choices.find((choice) => data[choice]);
        if (winChoice) {
            const choice = gc.Translator.gameTranslate(`${winChoice}_win`);
            this.label.string = this.upperCaseChoice ? choice.toUpperCase() : choice;
        }

        return winChoice;
    }
}
