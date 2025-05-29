import { _decorator, Component, Node, UITransform, Vec3 } from "cc";
import { SharpnessLabel } from "../../sharpness-label/sharpness-label";
const { ccclass, property } = _decorator;

@ccclass("StaticNode")
export class StaticNode extends Component {
    @property
    groupId = 0;

    originalParent: Node;
    originalPosition: Vec3;
    initialized = false;

    init() {
        this.initialized = true;
        this.originalParent = this.node.parent;
        this.originalPosition = this.node.position;
        this.originalParent.on(Node.EventType.TRANSFORM_CHANGED, this.updatePosition, this);
        this.updateSharpnessLabel();
    }

    updatePosition() {
        this.node.position = this.node.parent
            .getComponent(UITransform)
            .convertToNodeSpaceAR(this.originalParent.getComponent(UITransform).convertToWorldSpaceAR(this.originalPosition));
    }

    lateUpdate() {
        if (!this.initialized) {
            return;
        }
        this.checkOriginalParentExists();
    }

    checkOriginalParentExists() {
        if (!this.originalParent?.isValid) {
            this.node.destroy();
        }
    }

    updateSharpnessLabel() {
        const sharpnessLabel = this?.node?.getComponent(SharpnessLabel);
        sharpnessLabel && sharpnessLabel?.label?.updateRenderData(true);
    }
}
