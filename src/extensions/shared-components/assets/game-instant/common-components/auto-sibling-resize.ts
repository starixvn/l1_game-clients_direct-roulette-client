import { Component, Node, RichText, UITransform, Widget, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AutoSiblingResize")
export class AutoSiblingResize extends Component {
    @property(Node)
    target: Node = null;

    @property
    syncWidth = true;

    @property
    syncHeight = true;

    @property
    ratioWidth = 1;

    @property
    ratioHeight = 1;

    onLoad() {
        this.target.on(Node.EventType.SIZE_CHANGED, this.resizeNode, this);
        this.resizeNode();
    }

    update(dt) {
        this.resizeNode();
    }

    onDestroy() {
        this.target.off(Node.EventType.SIZE_CHANGED, this.resizeNode, this);
    }

    resizeNode() {
        this.setWidth();
        this.setHeight();

        const richText = this.getComponent(RichText);
        if (richText) {
            richText.maxWidth = this.node.getComponent(UITransform).width;
        }

        this.node.children.forEach((child) => {
            const widget = child.getComponent(Widget);
            if (widget) {
                widget.updateAlignment();
            }
        });
    }

    setWidth() {
        if (this.syncWidth) {
            this.node.getComponent(UITransform).width = this.target.getComponent(UITransform).width * this.ratioWidth;
        }
    }

    setHeight() {
        if (this.syncHeight) {
            this.node.getComponent(UITransform).height = this.target.getComponent(UITransform).height * this.ratioHeight;
        }
    }
}
