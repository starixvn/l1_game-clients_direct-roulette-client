import { _decorator, Component, Label } from "cc";
import { ComponentUtils } from "db://shared-components/shared/utils";
const { ccclass, property } = _decorator;

@ccclass
export class WarningCmp extends Component {
    @property(Label)
    lblMessage: Label = null;

    onEnable() {
        ComponentUtils.autoDisappear(this.node);
    }

    setData(message: string) {
        this.lblMessage.string = message;
    }
}
