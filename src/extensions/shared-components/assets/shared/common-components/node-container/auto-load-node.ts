import { _decorator, log } from "cc";
import { LazyloadAsset } from "./lazyload-asset";
import { LazyloadNodeContainer } from "./lazyload-node-container";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("AutoLoadNode")
@requireComponent(LazyloadAsset)
export class AutoLoadNode extends LazyloadNodeContainer {
    async onLoad() {
        await this.createNodeAsync();
        super.onLoad();
    }

    createNode() {
        if (this.node.children.length > 0) {
            log("AutoLoadNode: node already has children");
            return null;
        }
        return super.createNode();
    }
}
