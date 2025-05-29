import { _decorator, instantiate, Prefab } from "cc";
import { ObserverComponent } from "../../common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;

@ccclass("NodeContainer")
export class NodeContainer extends ObserverComponent {
    @property(Prefab)
    prefab: Prefab = null;

    createNode() {
        if (!this.prefab) {
            return null;
        }
        const node = instantiate(this.prefab);
        this.node.addChild(node);
        return node;
    }
}
