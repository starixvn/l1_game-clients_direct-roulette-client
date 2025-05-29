import { _decorator, Asset, Component, JsonAsset, log, SpriteAtlas, SpriteFrame } from "cc";
import { getLocalizedPath, getSpritePath } from "db://i18n/localized-utils";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
const { ccclass, property } = _decorator;

interface PreloadConfig {
    localized: {
        [bundleName: string]: {
            [pathType: string]: string[];
        }; // values are sprite names
    };
    others: {
        [bundleName: string]: string[]; // values are assets paths
    };
}

@ccclass("PreloadAssets")
export class PreloadAssets extends Component {
    @property(JsonAsset)
    config: JsonAsset = null;

    async preloadAssets() {
        if (!this.config) {
            return;
        }

        const info = this.config.json as PreloadConfig;
        const { others, localized } = info;
        log(`preload asset start ---------------------- `);
        for (const bundleName of Object.keys(others)) {
            const paths = others[bundleName];
            for (const path of paths) {
                log(`preload asset ${bundleName} --- ${path}`);
                await bundleManager.loadAssetsFromBundle<Asset>(bundleName, path, Asset, null);
            }
        }

        for (const bundleName of Object.keys(localized)) {
            const data = localized[bundleName];
            for (const pathType of Object.keys(data)) {
                const sprites = data[pathType];
                for (const spriteName of sprites) {
                    const isAtlas = spriteName.includes("atlas");
                    if (isAtlas) {
                        const path = getLocalizedPath(pathType, "i18n-images", spriteName);
                        log(`preload asset ${bundleName} --- ${path}`);
                        await bundleManager.loadAssetsFromBundle(bundleName, path, SpriteAtlas, null);
                    } else {
                        const spritePath = getSpritePath(pathType, "i18n-images", spriteName);
                        log(`preload asset ${bundleName} --- ${spritePath}`);
                        await bundleManager.loadAssetsFromBundle(bundleName, spritePath, SpriteFrame, null);
                    }
                }
            }
        }

        log(`preload asset end   ---------------------- `);
    }
}
