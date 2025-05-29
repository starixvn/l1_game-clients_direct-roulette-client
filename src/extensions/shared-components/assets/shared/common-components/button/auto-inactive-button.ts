import { Button, Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class AutoInactiveButton extends Component {
    @property
    durationInactive = 1;

    private button: Button;
    onLoad() {
        this.button = this.getComponent(Button);
        this.node.on("click", this.buttonClick, this);
    }

    onDestroy() {
        this.node.off("click", this.buttonClick, this);
    }

    buttonClick() {
        this.button.interactable = false;

        setTimeout(() => {
            if (this.node === null) {
                return;
            }
            this.button.interactable = true;
        }, this.durationInactive * 1000);
    }
}
