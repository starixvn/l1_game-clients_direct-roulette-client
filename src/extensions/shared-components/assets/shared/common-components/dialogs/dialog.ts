import { _decorator, Component, Node } from "cc";
import { AnimationUtils } from "../../utils/utils";
import { DialogTransition } from "./transition/dialog-transition";

const { bounceIn, bounceOut, fadeIn, fadeOut, stopFade } = AnimationUtils;
const { ccclass, property } = _decorator;

@ccclass("Dialog")
export class Dialog extends Component {
    @property(Node)
    nodeFadeBackground: Node = null;

    @property(Node)
    nodeBody: Node = null;

    @property
    autoShowWhenEnable = true;

    protected readonly appearDuration = 0.4;

    onShowComplete = () => {};
    onHideComplete = () => {};

    onEnable() {
        this.autoShowWhenEnable && this.show();
    }

    async show() {
        const promises = [];
        if (this.nodeFadeBackground) {
            this.nodeFadeBackground.active = true;
            stopFade(this.nodeFadeBackground);
            promises.push(fadeIn(this.nodeFadeBackground, 0.1));
        }

        if (this.nodeBody) {
            const transition = this.getBodyTransition();
            promises.push(transition.show(true));
        }

        await Promise.all(promises);
        this.onShowComplete?.();
    }

    getBodyTransition() {
        return this.nodeBody.getComponent(DialogTransition) ?? this.nodeBody.addComponent(DialogTransition);
    }

    showQuickly() {
        if (this.nodeFadeBackground) {
            this.nodeFadeBackground.active = true;
            AnimationUtils.setOpacityNode(this.nodeFadeBackground, 255);
        }

        if (this.nodeBody) {
            this.getBodyTransition().show(false);
        }

        this.onShowComplete?.();
    }

    hideQuickly() {
        if (this.nodeFadeBackground) {
            stopFade(this.nodeFadeBackground);
            this.nodeFadeBackground.active = false;
        }
        if (this.nodeBody) {
            this.node?.destroy();
        }
        this.onHideComplete?.();
    }

    async hide() {
        const promises = [];

        if (this.nodeFadeBackground) {
            stopFade(this.nodeFadeBackground);
            promises.push(
                fadeOut(this.nodeFadeBackground, this.appearDuration).then(
                    () => this.nodeFadeBackground && (this.nodeFadeBackground.active = false)
                )
            );
        }

        if (this.nodeBody) {
            promises.push(
                this.getBodyTransition()
                    .hide(true)
                    .then(() => {
                        this.node?.destroy();
                    })
            );
        }

        await Promise.all(promises);
        this.onHideComplete?.();
    }
}
