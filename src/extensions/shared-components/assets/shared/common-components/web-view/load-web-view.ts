import gc from "@sg/game-client-base";
import { Node, WebView, _decorator, tween } from "cc";
import { ObserverComponent } from "../observer-component/scripts/observer-component";

const { UrlUtils } = gc;
const { ccclass, property } = _decorator;

@ccclass
export default class LoadWebView extends ObserverComponent {
    @property(WebView)
    webView: WebView = null;

    @property(Node)
    nodeLoading: Node = null;

    protected url = "";
    protected onWebViewLoaded = () => {};

    onLoad(): void {
        super.onLoad();
        this.webView.node.on(
            "loaded",
            () => {
                const paddingTime = 0.3;
                tween(this.node)
                    .delay(paddingTime)
                    .call(() => {
                        this.hideLoading();
                        this.showWebView();
                    })
                    .start();
            },
            this
        );
    }

    loadWebView() {
        if (this.url) {
            this.showLoading();
            this.hideWebView();
            this.webView.url = this.url;
        }
    }

    setOpacity(opacity) {
        const iframe = this.webView?._impl?._wrapper;
        if (iframe && iframe.style) {
            iframe.style.opacity = opacity / 255;
        }
    }

    showWebView() {
        this.setOpacity(255);
        this.onWebViewLoaded();
    }

    hideWebView() {
        this.setOpacity(0);
    }

    destroyDivIframe() {
        this.webView.onDestroy();
    }

    showLoading() {
        this.nodeLoading.active = true;
    }

    hideLoading() {
        this.nodeLoading.active = false;
    }
}
