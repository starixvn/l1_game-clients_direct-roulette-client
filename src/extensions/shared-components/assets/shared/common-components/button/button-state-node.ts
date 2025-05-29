import { _decorator, Component, Enum, Node } from "cc";
import { ButtonStateEvent, CustomButton } from "./custom-button";
const { ccclass, property } = _decorator;
export enum State {
    NORMAL,
    DISABLED,
}
@ccclass("ButtonStateNode")
export class ButtonStateNode extends Component {
    @property(Node)
    buttonNode: Node = null;

    @property({ type: Enum(State) })
    state: State = State.NORMAL;

    onLoad() {
        this.buttonNode.on(ButtonStateEvent, this._onButtonStateChanged, this);

        this._onButtonStateChanged(this.buttonNode.getComponent(CustomButton).interactable);
    }

    private _onButtonStateChanged(interactable: boolean) {
        this.node.active = (interactable && this.state === State.NORMAL) || (!interactable && this.state === State.DISABLED);
    }
}
