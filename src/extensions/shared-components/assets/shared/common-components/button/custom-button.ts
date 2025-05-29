import { _decorator, Button } from "cc";
const { ccclass, property } = _decorator;

export const ButtonStateEvent = "button-state-changed";
@ccclass("CustomButton")
export class CustomButton extends Button {
    protected _updateState(): void {
        const state = this._getButtonState();
        this._applyTransition(state);
        this.node.emit(ButtonStateEvent, this.interactable);
    }
}
