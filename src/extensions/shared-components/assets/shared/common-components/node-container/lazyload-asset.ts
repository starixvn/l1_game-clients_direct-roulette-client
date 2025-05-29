import { _decorator, Asset, Component } from "cc";
import { bundleManager } from "../bundle-manager/bundle-manager";
const { ccclass, property } = _decorator;

// Định nghĩa kiểu Constructor
type Constructor<T = any> = new (...args: any[]) => T;

@ccclass("LazyloadAsset")
export class LazyloadAsset extends Component {
    @property
    bundleName = "resources";

    @property
    path = "prefabs/";

    async loadAsset<T extends Asset>(assetType: any) {
        return await bundleManager.loadAssetsFromBundle<T>(this.bundleName, this.path, assetType, null);
    }
}
