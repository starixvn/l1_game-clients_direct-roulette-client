import { _decorator, Component, Node, RichText, UIRenderer, UITransform, Vec3, Widget } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AutoResizeNode")
export class AutoResizeNode extends Component {
    @property(Node)
    target: Node = null;

    @property
    syncWidth = true;

    @property
    syncHeight = true;

    @property
    syncPosition = false;

    @property({
        visible: function () {
            return this.syncWidth;
        },
    })
    ratioWidth = 1;

    @property({
        visible: function () {
            return this.syncHeight;
        },
    })
    ratioHeight = 1;

    @property({
        visible: function () {
            return this.syncWidth;
        },
    })
    widthPadding = 0;

    @property({
        visible: function () {
            return this.syncHeight;
        },
    })
    heightPadding = 0;

    onLoad() {
        this.target?.on(Node.EventType.SIZE_CHANGED, this.resizeNode, this);
        this.resizeNode();
        if (this.syncPosition) {
            this.target?.on(Node.EventType.TRANSFORM_CHANGED, this.doSyncPosition, this);
            this.doSyncPosition();
        }
    }

    doSyncPosition() {
        this.node.position = this.node.parent
            .getComponent(UITransform)
            .convertToNodeSpaceAR(this.target.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO));
    }

    update(dt) {
        this.resizeNode();
        this.syncPosition && this.doSyncPosition();
    }

    onDestroy() {
        this.target?.isValid && this.target.off(Node.EventType.SIZE_CHANGED, this.resizeNode, this);
        this.target?.isValid && this.target.off(Node.EventType.TRANSFORM_CHANGED, this.doSyncPosition, this);
    }

    resizeNode() {
        this.setWidth();
        this.setHeight();

        const richText = this.getComponent(RichText);
        if (richText) {
            richText.maxWidth = this.node.getComponent(UITransform).width;
        }
        this.getComponent(UIRenderer)?.markForUpdateRenderData();

        this.node.children.forEach((child) => {
            const widget = child.getComponent(Widget);
            if (widget) {
                widget.updateAlignment();
            }
        });
    }

    setWidth() {
        if (this.syncWidth) {
            this.node.getComponent(UITransform).width =
                this.target.getComponent(UITransform).width * this.ratioWidth + 2 * this.widthPadding;
        }
    }

    setHeight() {
        if (this.syncHeight) {
            this.node.getComponent(UITransform).height =
                this.target.getComponent(UITransform).height * this.ratioHeight + 2 * this.heightPadding;
        }
    }
}
