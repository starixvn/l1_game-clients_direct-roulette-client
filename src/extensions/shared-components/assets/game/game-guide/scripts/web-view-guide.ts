import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import LoadWebView from "../../../shared/common-components/web-view/load-web-view";

const { GameGuide, GameConfigs, UrlUtils } = gc;
const { handle, render } = Observer;
const { ccclass } = _decorator;

@ccclass
export default class WebViewGuide extends LoadWebView {
    private gameConfig: gc.GameConfigs.GameConfigStore;

    @handle(GameGuide.GameGuideHandlers.GetGuideURL)
    initUrl(specialDirection = "", scrollToId = "") {
        const theme = "blue";
        return { theme, specialDirection, scrollToId };
    }

    @render(GameConfigs.GameConfigStore, (store) => store)
    setGameConfigs(gameConfigs: gc.GameConfigs.GameConfigStore) {
        this.gameConfig = gameConfigs;
    }

    sendDataToIframe(gameConfigs: gc.GameConfigs.GameConfigStore) {
        const guideUrl = UrlUtils.getSubDomain(this.url);
        this.onWebViewLoaded = () => {
            (document.getElementById("webview") as HTMLIFrameElement)?.contentWindow?.postMessage(JSON.stringify(gameConfigs), guideUrl);
        };
    }

    @render(GameGuide.GameGuideStore, (store) => store.url)
    loadGameGuide(url: string) {
        this.loadContent(url);
    }

    loadContent(url: string) {
        if (url) {
            this.url = url;
            this.sendDataToIframe(this.gameConfig);
            this.loadWebView();
        }
    }
}
