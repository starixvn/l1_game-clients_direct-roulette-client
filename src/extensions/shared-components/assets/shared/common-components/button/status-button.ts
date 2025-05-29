import { Button, Node, _decorator } from "cc";
const { ccclass, property } = _decorator;

export enum ButtonState {
    NORMAL,
    HOVER,
    PRESSED,
    DISABLED,
}

@ccclass("StatusButton")
export class StatusButton extends Button {
    @property(Node)
    disableNode: Node = null;

    @property(Node)
    activeNode: Node = null;

    _applyTransition(state: any) {
        super._applyTransition(state);
        if (this.activeNode) {
            this.activeNode.active = state === ButtonState.HOVER || state === ButtonState.PRESSED;
        }
        if (this.disableNode) {
            this.disableNode.active = state === ButtonState.DISABLED;
        }
    }
}
