import { Component, Node, UITransform, _decorator, macro, rect, v3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class AutoHideItemContainer extends Component {
    @property(Node)
    container: Node = null;

    @property(Node)
    mask: Node = null;

    maskTransform: UITransform;
    onLoad() {
        this.maskTransform = this.mask.getComponent(UITransform);
        this.schedule(this.checkBorder, 0.1, macro.REPEAT_FOREVER);
    }

    checkBorder() {
        const items = this.container.children;
        const box = this.maskTransform.getBoundingBox();
        const pos = this.maskTransform.convertToWorldSpaceAR(v3(0, 0));
        const container = rect(pos.x - box.width / 2, pos.y - box.height / 2, box.width, box.height);
        items.forEach((item) => {
            const itemBox = item.getComponent(UITransform).getBoundingBoxToWorld();
            const show = container.intersects(itemBox);
            item.children.forEach((child) => (child.active = show));
        });
    }
}
