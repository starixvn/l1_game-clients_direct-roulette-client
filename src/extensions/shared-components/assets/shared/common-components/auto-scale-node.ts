import { _decorator, Component, Node, v3, Widget } from "cc";

const { ccclass, property } = _decorator;

@ccclass("AutoScaleNode")
export class AutoScaleNode extends Component {
    @property(Node)
    target: Node = null;

    @property
    syncScaleX = true;

    @property
    syncScaleY = false;

    @property
    syncScaleZ = false;

    onLoad() {
        this.target?.on(Node.EventType.SIZE_CHANGED, this.scaleNode, this);
        this.scaleNode();
    }

    scaleNode() {
        this.setScaleX();
        this.setScaleY();
        this.setScaleZ();

        const widget = this.node.getComponent(Widget);
        if (widget) {
            widget.updateAlignment();
        }

        this.node.children.forEach((child) => {
            const widget = child.getComponent(Widget);
            if (widget) {
                widget.updateAlignment();
            }
        });
    }

    update(dt) {
        this.scaleNode();
    }

    onDestroy() {
        this.target?.isValid && this.target.off(Node.EventType.SIZE_CHANGED, this.scaleNode, this);
        this.target?.isValid && this.target.off(Node.EventType.TRANSFORM_CHANGED, this.scaleNode, this);
    }

    setScaleX() {
        if (this.syncScaleX) {
            this.node.scale = v3(this.target.scale.x, this.node.scale.y, this.node.scale.z);
        }
    }

    setScaleY() {
        if (this.syncScaleY) {
            this.node.scale = v3(this.node.scale.x, this.target.scale.y, this.node.scale.z);
        }
    }

    setScaleZ() {
        if (this.syncScaleZ) {
            this.node.scale = v3(this.node.scale.x, this.node.scale.y, this.target.scale.z);
        }
    }
}
