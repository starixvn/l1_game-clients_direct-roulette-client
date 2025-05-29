import { Component, Node, Prefab, _decorator, instantiate } from "cc";
import { bundleManager } from "../../../shared/common-components/bundle-manager/bundle-manager";
import { ComponentUtils, FunctionUtils } from "../../../shared/utils";
import Splash from "./splash";
const { ccclass } = _decorator;

@ccclass("SplashInstantVisibility")
export default class SplashInstantVisibility extends Component {
    splashInfo: Node = null;

    async onLoad() {
        await this.loadSplash();
    }

    private async loadSplash() {
        const assetPath = this.getAssetPath();

        const [splashInfoPrefab, splashBackgroundPrefab] = await Promise.all([
            this.loadSplashInfo(assetPath),
            this.loadBackgroundSplash(assetPath),
        ]);

        if (splashInfoPrefab && splashBackgroundPrefab) {
            this.instantiateSplash(splashInfoPrefab, splashBackgroundPrefab);
        }
    }

    private getAssetPath() {
        return FunctionUtils.isPortraitMode() ? "portrait" : "landscape";
    }

    protected async loadSplashInfo(assetPath: string) {
        let splashInfoPrefab: Prefab = null;

        try {
            splashInfoPrefab = await bundleManager.loadInstantSharedAsset<Prefab>(`splash/${assetPath}/splash-info`, Prefab, null);
        } catch (error) {
            console.error("Failed to load splash info:", error);
        }

        return splashInfoPrefab;
    }

    private async loadBackgroundSplash(assetPath: string) {
        let splashBackgroundPrefab: Prefab = null;
        const bundleName = "background-splash-bundle";

        try {
            splashBackgroundPrefab = await bundleManager.loadAssetsFromBundle<Prefab>(
                bundleName,
                `${assetPath}/splash-background`,
                Prefab,
                null
            );
        } catch (error) {
            console.error("Failed to load splash background:", error);
        }

        return splashBackgroundPrefab;
    }

    private instantiateSplash(splashInfoPrefab: Prefab, splashBackgroundPrefab: Prefab) {
        const splashInfo = instantiate(splashInfoPrefab);
        const splashCmp = splashInfo?.getComponent(Splash);

        if (splashCmp) {
            ComponentUtils.addChildFromPrefab(splashBackgroundPrefab, splashCmp.containerCustomize);
        }

        if (splashInfo) {
            this.node.addChild(splashInfo);
        }
    }
}
