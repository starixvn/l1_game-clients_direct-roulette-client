import { Asset, AssetManager, assetManager, log } from "cc";

export class BundleManager {
    private static _instance: BundleManager;
    public static getInstance(): BundleManager {
        if (!this._instance) {
            this._instance = new BundleManager();
        }
        return this._instance;
    }
    private bundles = {};
    async loadBundle(name: string): Promise<AssetManager.Bundle> {
        if (this.bundles[name]) {
            return this.bundles[name];
        }

        return new Promise<AssetManager.Bundle>((resolve, reject) => {
            assetManager.loadBundle(name, (err, bundle) => {
                if (err) {
                    log("Can not load bundle ", name);
                    resolve(null);
                    return;
                }
                this.bundles[name] = bundle;
                resolve(bundle);
            });
        });
    }

    async getRemoteAsset<T extends Asset>(url: string): Promise<T | null> {
        return new Promise((resolve) => {
            assetManager.loadRemote<T>(url, (error, asset) => {
                if (error) {
                    log(`Failed to load asset from ${url}:`, error);
                    resolve(null);
                    return;
                }

                log(`Successfully loaded asset from ${url}`);
                resolve(asset);
            });
        });
    }

    async loadAssetsFromBundle<AssetType extends Asset>(
        bundleName: string,
        assetPath: string,
        assetType: any,
        onProgress: ((finished: number, total: number) => void) | null
    ) {
        const bundle = await this.loadBundle(bundleName);
        if (bundle) {
            return new Promise<AssetType>((resolve) => {
                bundle.load(assetPath, assetType, onProgress, (err, asset) => {
                    if (err) {
                        log(`Cannot load asset ${assetPath} from bundle ${bundleName}`);
                        resolve(null);
                    } else {
                        resolve(asset as AssetType);
                    }
                });
            });
        }

        return null;
    }

    loadSharedAsset<AssetType extends Asset>(
        assetPath: string,
        assetType: any,
        onProgress: ((finished: number, total: number) => void) | null = null
    ) {
        return this.loadAssetsFromBundle<AssetType>("shared-bundle", assetPath, assetType, onProgress);
    }

    loadInstantSharedAsset<AssetType extends Asset>(
        assetPath: string,
        assetType: any,
        onProgress: ((finished: number, total: number) => void) | null = null
    ) {
        return this.loadAssetsFromBundle<AssetType>("shared-instant-bundle", assetPath, assetType, onProgress);
    }

    loadResourcesAsset<AssetType extends Asset>(
        assetPath: string,
        assetType: any,
        onProgress: ((finished: number, total: number) => void) | null = null
    ) {
        return this.loadAssetsFromBundle<AssetType>("resources", assetPath, assetType, onProgress);
    }

    loadPortraitDirectSharedAsset<AssetType extends Asset>(
        assetPath: string,
        assetType: any,
        onProgress: ((finished: number, total: number) => void) | null = null
    ) {
        return this.loadAssetsFromBundle<AssetType>("shared-portrait-direct-bundle", assetPath, assetType, onProgress);
    }
}

export const bundleManager = BundleManager.getInstance();
