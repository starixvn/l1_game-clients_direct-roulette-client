import gc from "@sg/game-client-base";
import { _decorator, Component, Label, tween, Tween, UIOpacity, v3 } from "cc";
import { shuffle } from "lodash-es";
const { ccclass, property } = _decorator;

@ccclass
export class RandomWaitingMessage extends Component {
    @property(Label)
    messageLabel: Label = null;

    private readonly animationDuration = 1;
    private readonly displayMessageTime = 4;
    private readonly moveY = 35;
    currentIndex = 0;
    messageList = ["message_download_first_visit", "splash_check_downloading"];
    messageTween: Tween;
    private uiOpacity: UIOpacity;

    onLoad() {
        this.uiOpacity = this.messageLabel.node.getComponent(UIOpacity) || this.messageLabel.node.addComponent(UIOpacity);
        this.messageList = shuffle(this.messageList);
        this.showMessage(0);
    }

    showMessage(duration = 1) {
        this.currentIndex++;
        if (this.currentIndex > this.messageList.length - 1) {
            this.currentIndex = 0;
        }
        this.setMessage(gc.Translator.commonTranslate(this.messageList[this.currentIndex]));
        const messageNode = this.messageLabel.node;
        messageNode.position = v3(messageNode.position.x, -this.moveY, 0);
        this.uiOpacity.opacity = 0;

        this.messageTween = tween(messageNode)
            .parallel(
                tween().to(duration, { position: v3(0, 0, 0) }, { easing: "sineIn" }),
                tween(this.uiOpacity).to(duration, { opacity: 255 }, { easing: "sineIn" })
            )
            .delay(this.displayMessageTime)
            .call(() => {
                this.hideMessage();
            })
            .start();
    }

    hideMessage() {
        this.messageTween = tween(this.messageLabel.node)
            .parallel(
                tween().to(this.animationDuration, { position: v3(0, this.moveY, 0) }, { easing: "sineOut" }),
                tween(this.uiOpacity).to(this.animationDuration, { opacity: 0 }, { easing: "sineOut" })
            )
            .call(() => {
                this.showMessage();
            })
            .start();
    }

    reset() {
        this.messageTween.stop();
        this.uiOpacity.opacity = 255;
        this.messageLabel.node.position = v3(0, 0, 0);
    }

    setMessage(message: string) {
        this.messageLabel.string = message;
    }
}
