import gc from "@sg/game-client-base";
import { _decorator, Component, director, instantiate, Label, log, Node, Prefab, ProgressBar } from "cc";
import Observer from "observer";

import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import GameConnection from "../../../shared/common-components/game-connection";
import { ComponentUtils, FunctionUtils } from "../../../shared/utils";
import { ErrorMessage } from "../error-message";
import { PreloadAssets } from "./preload-assets";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;
const { Auth, ChipSetting, sentryLogger, BrowserDomUtils, App, AppTypes } = gc;

declare global {
    interface Window {
        dataLayer: any[];
        gtag: Function;
    }
}
@ccclass
export default class SplashComponentBase extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar = null;

    @property(ErrorMessage)
    cpnMessage: ErrorMessage = null;

    @property(Node)
    signNameContainer: Node = null;

    @property(Label)
    percentResourceLoad: Label = null;

    @property(Node)
    containerCustomize: Node = null;

    @property(Prefab)
    prefabCustomize: Prefab = null;

    @property(Node)
    nodeLogoContainer: Node = null;

    @property(Prefab)
    prefabLogo: Prefab = null;

    @property(Node)
    gameName: Node = null;

    gameConnection: GameConnection = null;

    protected system: number = AppTypes.Club;
    protected preloadAssetsComp: PreloadAssets;

    onLoad() {
        this.preloadAssetsComp = this.getComponent(PreloadAssets);
        this.initSentry();
        gc.initMobxLogger();
        this.initGameConnectionComponent();
        this.updateProgressBar(0);
        this.sso();
        ComponentUtils.addChildFromPrefab(this?.prefabCustomize, this?.containerCustomize);
        window.addEventListener("message", this.registerEvents);
        this.initGA();
        this.addGATrackingButton();
    }

    start() {
        const logo = instantiate(this?.prefabLogo);
        this.nodeLogoContainer?.addChild(logo);
    }

    onDestroy(): void {
        window.removeEventListener("message", this.registerEvents);
    }

    protected onEnable(): void {
        BrowserDomUtils.postMessageToParent({ splashEnabled: true });
    }

    protected registerEvents = (event: MessageEvent) => {
        this.removeUserSetting(event);
        this.registerEventUserGesturePage(event);
    };

    removeUserSetting(event: MessageEvent) {
        if (event?.data?.isClearStorage) {
            this.handleClearStorage();
        }
    }

    @handle(App.AppHandlers.ClearStorage)
    handleClearStorage() {
        return true;
    }

    @handle(App.AppHandlers.UserGesturePage)
    protected registerEventUserGesturePage(event: MessageEvent) {
        return event.data?.isUserGesture || false;
    }

    private initGameConnectionComponent() {
        this.gameConnection = this.getComponent(GameConnection);
        if (this.gameConnection) {
            this.gameConnection.openGameCallback = () => this.loadSceneGame();
        }
    }

    @handle(Auth.AuthHandlers.SSO)
    sso() {
        return new URLSearchParams(window.location.search);
    }

    @render(Auth.AuthStore, (store) => ({
        isAuthorized: store.isAuthorized,
        system: store.system,
    }))
    openGame({ isAuthorized, system }) {
        if (isAuthorized) {
            this.system = system;
            this.loadChipSetting();
            this.triggerRecheckIn();
            this.connectToGameService();
        }
    }

    protected initSentry() {
        if (!window?.envConfig) {
            return;
        }

        const envConfig = window.envConfig;
        gc.sentryLogger.start(envConfig?.sentryUrl, envConfig?.env, envConfig.mainObserverNamespace);
    }

    connectToGameService() {
        this.gameConnection?.connectToService();
    }

    @render(Auth.AuthStore, (store) => store.ssoErrorMessage, { fireImmediately: false })
    renderMessage(message: string) {
        this.cpnMessage.reset();
        this.cpnMessage.setMessage(message);
        this.gameName && (this.gameName.active = false);
    }

    updateProgressBar(progress: number) {
        if (this.progressBar) {
            this.gameName && (this.gameName.active = true);
            this.percentResourceLoad && (this.percentResourceLoad.string = `${Math.round(progress * 100)}%`);
            this.progressBar.progress = progress;
        }
    }

    async preloadAssets() {
        if (this.preloadAssetsComp) {
            await this.preloadAssetsComp.preloadAssets();
        }
    }

    loadSceneGame() {
        const sceneName = this.sceneName;
        this.preloadAssets();
        director.preloadScene(
            sceneName,
            (completedCount: number, totalCount: number) => {
                this.updateProgressBar(completedCount / totalCount);
            },
            (error) => {
                if (error) {
                    sentryLogger?.logError(error);
                } else {
                    director.loadScene(sceneName);
                }
            }
        );
    }

    get sceneName(): any {
        if (this.system === AppTypes.Instant) {
            return FunctionUtils.isPortraitMode() ? "game-instant-portrait" : "game-instant-landscape";
        }

        return "game";
    }

    @handle(Auth.AuthHandlers.TriggerRecheckIn)
    triggerRecheckIn() {}

    @handle(ChipSetting.ChipSettingHandler)
    loadChipSetting() {}

    @render(Auth.AuthStore, (store) => store.isShowSignName, { fireImmediately: false })
    handleShowSignName(isShowSignName: boolean) {
        this.toggleSignNameContainer(isShowSignName);
        this.updateContentUnderBackground(!isShowSignName);
        if (isShowSignName) {
            this.createSignName();
        }
    }

    async createSignName() {
        if (this.signNameContainer) {
            try {
                const prefab = await bundleManager.loadAssetsFromBundle<Prefab>("shared-bundle", "prefabs/sign-name", Prefab, null);
                this.signNameContainer.addChild(instantiate(prefab));
            } catch (error) {
                log(error);
            }
        }
    }

    private toggleSignNameContainer(isActive: boolean) {
        this.signNameContainer && (this.signNameContainer.active = isActive);
    }

    private updateContentUnderBackground(status: boolean) {
        this.progressBar && (this.progressBar.node.active = status);
        this.cpnMessage && (this.cpnMessage.node.active = status);
    }

    private initGA() {
        const gaCode = window.envConfig.systemType === "SG" ? "G-GJDD3FENTH" : "G-JHKMX35LM3";

        this.loadScript(`https://www.googletagmanager.com/gtag/js?id=${gaCode}`).then(
            () => {
                console.log("Init GA");
                window.dataLayer = window.dataLayer || [];
                function gtag(...args: any[]) {
                    window.dataLayer.push(args);
                }
                gtag("js", new Date());
                gtag("config", gaCode);
            },
            (reason) => {
                console.log("Init GA failed with" + reason);
            }
        );
    }

    private addGATrackingButton() {
        if (window.envConfig.env !== "PROD") {
            return;
        }
        const gaCode = "G-W13X2FGNGN";
        this.loadScript(`https://www.googletagmanager.com/gtag/js?id=${gaCode}`).then(
            () => {
                console.log("Init GA");
                window.dataLayer = window.dataLayer || [];
                function gtag(...args: any[]) {
                    window.dataLayer.push(args);
                }
                gtag("js", new Date());
                gtag("config", gaCode);
                globalThis.gtag = gtag;
            },
            (reason) => {
                console.log("Init GA failed with" + reason);
            }
        );
    }

    private loadScript(src: string) {
        return new Promise(function (resolve, reject) {
            let script: HTMLScriptElement;
            script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        });
    }
}
