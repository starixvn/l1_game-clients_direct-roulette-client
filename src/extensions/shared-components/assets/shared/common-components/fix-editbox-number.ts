import { _decorator, Component, EditBox, sys } from "cc";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("FixEditBoxNumber")
@requireComponent(EditBox)
export class FixEditBoxNumber extends Component {
    private editBox: EditBox;

    onLoad() {
        this.editBox = this.getComponent(EditBox);
        if (this.editBox) {
            if (sys.isMobile) {
                this.editBox.inputMode = EditBox.InputMode.PHONE_NUMBER;
            } else {
                this.editBox.inputMode = EditBox.InputMode.DECIMAL;
            }
        }
    }
}
