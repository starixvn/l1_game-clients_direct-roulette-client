import { _decorator, Component, Node, Widget } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class BaccaratScoreboardContainer extends Component {
    @property(Node)
    beadRoad: Node = null;

    @property(Node)
    derivedNode: Node = null;

    @property(Node)
    nodeArrow: Node = null;

    private isCollapse = true;
    onClickCollapseExpand() {
        this.isCollapse = !this.isCollapse;
        this.nodeArrow.setScale(1, this.isCollapse ? 1 : -1);
        this.beadRoad && (this.beadRoad.active = !this.isCollapse);
        this.derivedNode.active = !this.isCollapse;
        this.node.children.forEach((child) => {
            const widget = child.getComponent(Widget);
            if (widget) {
                widget.updateAlignment();
            }
        });
    }
}
