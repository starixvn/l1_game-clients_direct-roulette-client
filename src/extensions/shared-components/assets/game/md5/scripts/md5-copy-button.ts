import gc from "@sg/game-client-base";
import { _decorator, Label, Node, tween, UIOpacity } from "cc";

import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { Translator } = gc;

@ccclass
export class Md5CopyButton extends ObserverComponent {
    @property(Node)
    nodeHintCopy: Node = null;
    public isCopying = false;
    protected lblHint: Label = null;

    onLoad() {
        super.onLoad();
        if (this.nodeHintCopy) {
            this.lblHint = this.nodeHintCopy.getChildByName("content").getComponent(Label);
            this.lblHint.string = Translator.commonTranslate("copy_successfully_md5");
        }
        window.addEventListener("message", this.registerEventCopyMD5);
    }

    onDestroy(): void {
        super.onDestroy();
        window.removeEventListener("message", this.registerEventCopyMD5);
    }

    private readonly registerEventCopyMD5 = (event: MessageEvent) => {
        const isSuccessful = event.data.copySuccessfully;
        if (isSuccessful !== undefined && this.isCopying) {
            this.isCopying = false;
            this.showHint(isSuccessful);
        }
    };

    public showHint(isSuccessful: boolean) {
        if (this.nodeHintCopy && this.lblHint) {
            const key = isSuccessful ? "copy_successfully_md5" : "copy_failed_md5";
            this.lblHint.string = gc.Translator.commonTranslate(key);
            tween(this.nodeHintCopy.getComponent(UIOpacity)).to(0.2, { opacity: 255 }).delay(1.5).to(0.1, { opacity: 1 }).start();
        }
    }

    public hideHint() {
        if (this.nodeHintCopy) {
            this.nodeHintCopy.getComponent(UIOpacity).opacity = 0;
        }
    }
}
