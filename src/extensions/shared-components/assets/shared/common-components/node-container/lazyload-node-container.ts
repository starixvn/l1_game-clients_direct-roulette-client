import { _decorator, Prefab } from "cc";
import { LazyloadAsset } from "./lazyload-asset";
import { NodeContainer } from "./node-container";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("LazyloadNodeContainer")
@requireComponent(LazyloadAsset)
export class LazyloadNodeContainer extends NodeContainer {
    @property({ visible: false, override: true })
    prefab: Prefab = null;

    async createNodeAsync() {
        if (!this.prefab) {
            await this.loadPrefab();
        }
        return this.createNode();
    }

    async loadPrefab() {
        if (!this.prefab) {
            const comp = this.getComponent(LazyloadAsset);
            if (comp) {
                this.prefab = await comp.loadAsset(Prefab);
            }
        }
    }
}
