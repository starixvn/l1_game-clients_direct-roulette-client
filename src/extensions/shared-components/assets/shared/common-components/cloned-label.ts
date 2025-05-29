import { _decorator, Component, Label } from "cc";
const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent(Label)
export class ClonedLabel extends Component {
    @property(Label)
    labelTarget: Label = null;

    label: Label = null;

    onLoad() {
        this.label = this.getComponent(Label);
        this.syncStringValue();
    }

    update() {
        this.syncStringValue();
    }

    private syncStringValue() {
        if (this.label && this.labelTarget) {
            this.label.string = this.labelTarget.string;
        }
    }
}
