import gc from "@sg/game-client-base";
import { _decorator, Button, Label, Sprite, Toggle, UIOpacity } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { FormatUtils, GameCrash } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoCashout extends ObserverComponent {
    @property(Label)
    multiplierLabel: Label = null;

    @property(Toggle)
    toggle: Toggle = null;

    @property(Button)
    increaseButton: Button = null;

    @property(Button)
    decreaseButton: Button = null;

    maxMultiplier: number;

    @property(Sprite)
    disableNode: Sprite = null;

    @handle(GameCrash.AutoCashOut.AutoCashOutHandler, (handle, enable: boolean) => handle.handleEnable(enable))
    toggleCheck() {
        return this.toggle.isChecked;
    }

    @handle(GameCrash.AutoCashOut.AutoCashOutHandler, (handle, value: number) => handle.adjustMultiplier(value))
    quickChangeMultiplier(value: number) {
        this.playSoundClick();
        return value;
    }

    @handle(GameCrash.AutoCashOut.AutoCashOutPopupHandler, (handle, value: boolean) => handle.togglePopup(value))
    openPopup() {
        this.playSoundClick();
        return true;
    }

    @render(GameCrash.AutoCashOut.AutoCashOutStore, (store) => store.multiplier)
    updateMultiplier(multiplier: number) {
        this.multiplierLabel.string = `${FormatUtils.numberWithCommas(multiplier, 2, false)}x`;
        this.updateButtonStatus(this.decreaseButton, multiplier > 1.01);
        this.updateButtonStatus(this.increaseButton, multiplier < this.maxMultiplier);
    }

    @render(gc.GameCrash.CrashGameConfigs.CrashGameConfigStore, (store) => store.maxMultiplier)
    updateMaxMultiplier(maxMultiplier: number) {
        this.maxMultiplier = maxMultiplier;
        const currentMultiplier = parseFloat(this.multiplierLabel.string);
        this.updateButtonStatus(this.decreaseButton, currentMultiplier > 1.01);
        this.updateButtonStatus(this.increaseButton, currentMultiplier < this.maxMultiplier);
    }

    @render(GameCrash.AutoCashOut.AutoCashOutStore, (store) => store.enable)
    updateEnable(enable: boolean) {
        this.playSoundClick();
        this.toggle.isChecked = enable;
    }

    updateButtonStatus(button: Button, status: boolean) {
        button.interactable = status;
        button.node.getComponent(UIOpacity).opacity = status ? 255 : 100;
    }

    increaseMultiplier() {
        this.quickChangeMultiplier(0.01);
    }

    decreaseMultiplier() {
        this.quickChangeMultiplier(-0.01);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.disabledAutoCashout)
    setDisabledAutoCashout(disabledAutoCashout: boolean) {
        this.disableNode.node.active = disabledAutoCashout;
    }
}
