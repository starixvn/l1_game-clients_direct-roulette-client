import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab } from "cc";
import LoadBoostedOddsContainerPrefab from "db://shared-components/game/boosted-odds/scripts/load-boosted-odds-container-prefab";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import Observer from "observer";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;
const { Notification } = gc;

@ccclass("LoadBoostedOddsDirectContainerPrefab")
export default class LoadBoostedOddsDirectContainerPrefab extends LoadBoostedOddsContainerPrefab {
    @property(Node)
    iconContainer: Node = null;

    protected static override readonly BundleConstants = {
        ...LoadBoostedOddsContainerPrefab.BundleConstants,
        sharePortraitDirectBundle: "shared-portrait-direct-bundle",
    };

    async getPrefabs(prefabName: string) {
        const { rootFolder } = LoadBoostedOddsDirectContainerPrefab.BundleConstants;
        const prefabPath = LoadBoostedOddsDirectContainerPrefab.BundleConstants.sharePortraitDirectBundle;

        return bundleManager.loadAssetsFromBundle<Prefab>(prefabPath, `${rootFolder}/${prefabName}`, Prefab, null);
    }

    protected override addBoostedOddIcon(prfBoostedOddIcon: Prefab) {
        this.iconContainer && this.iconContainer.addChild(instantiate(prfBoostedOddIcon));
    }

    @render(Notification.NotificationStore, (store) => store.isConnected)
    getPromotionNotifications(isConnected: boolean) {
        if (isConnected) {
            this.initPromotionNotifications();
        }
    }

    @handle(gc.Notification.NotificationHandlers.InitPromotionNotifications)
    initPromotionNotifications() {}
}
