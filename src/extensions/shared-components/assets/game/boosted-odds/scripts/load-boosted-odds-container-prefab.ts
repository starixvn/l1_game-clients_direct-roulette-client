import gc from "@sg/game-client-base";
import { _decorator, instantiate, Prefab } from "cc";
import Observer from "observer";
import { bundleManager } from "../../../shared/common-components/bundle-manager/bundle-manager";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../shared/utils";

const { ccclass } = _decorator;
const { handle, render } = Observer;
const { Auth, AppTypes } = gc;

@ccclass("LoadBoostedOddsContainerPrefab")
export default class LoadBoostedOddsContainerPrefab extends ObserverComponent {
    protected static readonly BundleConstants = {
        shareBundle: "shared-bundle",
        shareInstantBundle: "shared-instant-bundle",
        rootFolder: "boosted-odds",
        subPath: {
            portrait: "/portrait",
            landscape: "/landscape",
        },
        prefabs: {
            icon: "boosted-odds",
            container: "boosted-odds-container",
        },
        delayTimeForLoadContainer: 1000,
    };

    system: number = AppTypes.Club;
    @render(Auth.AuthStore, (store) => store.system)
    openGame(system: number) {
        this.system = system;
    }

    @render(
        gc.Notification.BoostedOddsStore,
        (store) => {
            return {
                isInstantVersion: store.isInstantVersion,
                boostedOddsCounter: store.boostedOddsCounter,
                shouldAddBoostedOddPrefab: store.shouldAddBoostedOddPrefab,
            };
        },
        { fireImmediately: false }
    )
    async addBoostedOddsContainerPrefab(model: {
        isInstantVersion: boolean;
        boostedOddsCounter: number;
        shouldAddBoostedOddPrefab: boolean;
    }) {
        if (model.shouldAddBoostedOddPrefab) {
            const { prefabs, delayTimeForLoadContainer } = LoadBoostedOddsContainerPrefab.BundleConstants;

            const prfBoostedOddContainer = await this.getPrefabs(prefabs.container);
            const prfBoostedOddIcon = await this.getPrefabs(prefabs.icon);

            this.addBoostedOddIcon(prfBoostedOddIcon);
            this.node.addChild(instantiate(prfBoostedOddContainer));

            setTimeout(() => {
                this.handleSetBoostedOddsLoadedPrefab();
            }, delayTimeForLoadContainer);
        }
    }

    protected addBoostedOddIcon(prfBoostedOddIcon: Prefab) {
        this.node.addChild(instantiate(prfBoostedOddIcon));
    }

    async getPrefabs(prefabName: string) {
        const { shareInstantBundle, shareBundle, subPath, rootFolder } = LoadBoostedOddsContainerPrefab.BundleConstants;

        const prefabPathMap = {
            [AppTypes.Instant]: shareInstantBundle,
        };

        const prefabPath = prefabPathMap[this.system] || shareBundle;
        const subpath = this.system === AppTypes.Instant ? (FunctionUtils.isPortraitMode() ? subPath.portrait : subPath.landscape) : "";

        return bundleManager.loadAssetsFromBundle<Prefab>(prefabPath, `${rootFolder}${subpath}/${prefabName}`, Prefab, null);
    }

    @handle(gc.Notification.BoostedOddsPromotionsHandlers.BoostedOddsPopupHandlers, (handler) => handler.setIsLoadedPrefab(true))
    handleSetBoostedOddsLoadedPrefab() {}
}
