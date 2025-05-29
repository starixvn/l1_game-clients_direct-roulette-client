import { Color, Node, UIRenderer, _decorator } from "cc";
import { ButtonState, StatusButton } from "../../../shared/common-components/button/status-button";
const { ccclass, property } = _decorator;

@ccclass("ReBetButton")
export class ReBetButton extends StatusButton {
    @property(Node)
    background: Node = null;

    private _enabledColor: string = null;
    private readonly _disableColor = "#414141";
    private readonly _defaultEnableColor = "#901e01";

    set enabledColor(color: string) {
        this._enabledColor = color;
    }

    _applyTransition(state: any) {
        super._applyTransition(state);
        if (state === ButtonState.NORMAL || state === ButtonState.HOVER || state === ButtonState.PRESSED) {
            this.setStatusButton(true);
        } else if (state === ButtonState.DISABLED) {
            this.setStatusButton(false);
        }
    }

    private updateBackground(enabled: boolean) {
        const color = enabled ? this._enabledColor || this._defaultEnableColor : this._disableColor;
        this.setBackground(color);
    }

    private setStatusButton(isEnabled: boolean) {
        this.activeNode.active = isEnabled;
        this.disableNode.active = !isEnabled;
        this.updateBackground(isEnabled);
    }

    private setBackground(color: string) {
        const renderer = this.background.getComponent(UIRenderer);
        const colorComp: Color = new Color(0, 0, 0, 255);
        renderer.color = Color.fromHEX(colorComp, color);
    }

    changeInteractable(value: boolean) {
        this.interactable = value;
    }
}
