import gc from "@sg/game-client-base";
import { _decorator, Button, Label, Node, UIOpacity } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

const { FormatUtils, GameCrash } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
@ccclass
export class BetInput extends ObserverComponent {
    @property(Label)
    lblBetAmount: Label = null;

    @property(Button)
    btnDecrease: Button = null;

    @property(Button)
    btnIncrease: Button = null;

    @property(Node)
    nodeDisabledLayer: Node = null;

    @render(GameCrash.BetInput.BetInputStore, (store) => store.isDisabledBetInput)
    private setDisabledLayerVisibility(isDisabledBetInput: boolean) {
        this.nodeDisabledLayer.active = isDisabledBetInput;
    }

    @render(GameCrash.BetInput.BetInputStore, (store) => store.betAmountRatio)
    private updateBetAmount(amount: number) {
        this.lblBetAmount.string = amount > 0 ? `${FormatUtils.numberWithCommas(amount, 2)}` : "";
    }

    @render(GameCrash.BetInput.BetInputStore, (store) => store.increaseStatus)
    private setIncreaseButtonStatus(increaseStatus: boolean) {
        this.handleStakeButtonQuickChange(this.btnIncrease, increaseStatus);
    }

    @render(GameCrash.BetInput.BetInputStore, (store) => store.decreaseStatus)
    private setDecreaseButtonStatus(decreaseStatus: boolean) {
        this.handleStakeButtonQuickChange(this.btnDecrease, decreaseStatus);
    }

    @handle(GameCrash.BetInput.BetInputHandler, (handle) => handle.openBetAmountPopup())
    private onClickOpenBetAmountPopup() {
        this.playSoundClick();
    }

    @handle(GameCrash.BetInput.BetInputHandler, (handle, isIncrease: boolean) => handle.quickChangeBetAmount(isIncrease))
    private onClickBetAmountQuickChange(event) {
        this.playSoundClick();
        return event.target.name === "increase";
    }

    private handleStakeButtonQuickChange(button: Button, status: boolean) {
        this.playSoundClick();
        button.interactable = status;
        button.node.getComponent(UIOpacity).opacity = status ? 255 : 100;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
