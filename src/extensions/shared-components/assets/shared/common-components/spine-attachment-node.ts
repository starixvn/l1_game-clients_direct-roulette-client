import { _decorator, Component, sp, UITransform, v3 } from "cc";

import { AnimationUtils } from "../utils";

const { ccclass, property } = _decorator;

@ccclass("SpineAttachmentNode")
export class SpineAttachmentNode extends Component {
    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property
    boneName = "";

    protected bone: sp.spine.Bone;
    protected slot: sp.spine.Slot;

    onLoad() {
        this.bone = this.skeleton.findBone(this.boneName);
        this.slot = this.skeleton.findSlot(this.boneName);
    }

    protected update(_: number): void {
        this.syncNodeWithBone();
    }

    syncNodeWithBone() {
        if (!this.bone) {
            return;
        }

        const wPos = this.skeleton.node.getComponent(UITransform).convertToWorldSpaceAR(v3(this.bone.worldX, this.bone.worldY));
        const localPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(wPos);
        this.node.position = localPos;
        this.slot?.color && AnimationUtils.setOpacityNode(this.node, this.slot.color.a * 255);
        this.node.setScale(this.bone.scaleX, this.bone.scaleY);
        this.node.angle = this.bone.rotation;
    }
}
