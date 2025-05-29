import { _decorator, Component, Node, randomRangeInt, warn } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class RandomChildActivator extends Component {
    onLoad() {
        this.activateRandomChild();
    }

    protected activateRandomChild() {
        const children = this.node.children;

        if (!children.length) {
            warn("No children found to activate.");
            return;
        }

        children.forEach((child) => (child.active = false));
        const randomChild = children[randomRangeInt(0, children.length)];
        randomChild.active = true;
    }
}
