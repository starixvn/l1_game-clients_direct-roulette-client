import { Button, Component, Label, _decorator } from "cc";

const { ccclass, property, menu } = _decorator;

@ccclass("Identifier")
@menu("Integration/Identifier")
export class Identifier extends Component {
    @property
    id = "";

    get isLabel() {
        return !!this.label;
    }

    get label(): Label {
        return this.node.getComponent(Label);
    }

    get isButton() {
        return !!this.button;
    }

    get button(): Button {
        return this.node.getComponent(Button);
    }
}
