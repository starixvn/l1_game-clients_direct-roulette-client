import { Component, Node, Toggle, _decorator } from "cc";
const { ccclass, property, executeInEditMode, requireComponent } = _decorator;

@ccclass
@executeInEditMode
@requireComponent(Toggle)
export class ToggleNode extends Component {
    private _toggle: Toggle = null;

    @property({ type: Node })
    checkedNodes: Node[] = [];

    @property({ type: Node })
    unCheckedNodes: Node[] = [];

    get toggle() {
        if (!this._toggle) {
            this._toggle = this.getComponent(Toggle);
        }
        return this._toggle;
    }

    onLoad() {
        this.toggle.node.on(Toggle.EventType.TOGGLE, this.updateDisplay, this);
        this.updateDisplay();
    }

    updateDisplay() {
        this.checkedNodes.forEach((node) => (node.active = this.toggle.isChecked));
        this.unCheckedNodes.forEach((node) => (node.active = !this.toggle.isChecked));
    }
}
