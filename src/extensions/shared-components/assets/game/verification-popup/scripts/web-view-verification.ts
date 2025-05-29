import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";
import LoadWebView from "../../../shared/common-components/web-view/load-web-view";

const { UrlUtils, PFVerification } = gc;
const { handle, render } = Observer;
const { ccclass, property } = _decorator;

@ccclass
export default class WebViewVerification extends LoadWebView {
    private provablyFair: gc.GameServiceMessage.ProvablyFair;
    @property(Label)
    lblRound: Label = null;

    onLoad() {
        super.onLoad();
        this.initUrl();
    }

    @handle(PFVerification.WebViewPFVerificationHandlers.GetVerificationURL)
    initUrl(specialDirection = "", scrollToId = "") {
        const theme = "blue";
        return { theme, specialDirection, scrollToId };
    }

    @render(gc.RoundPF.RoundPFStore, (store) => store.pf)
    setProvablyFair(pf: gc.GameServiceMessage.RoundPFResult) {
        this.provablyFair = pf;
        this.lblRound && (this.lblRound.string = pf.roundId.toString());
    }

    sendDataToIframe(provablyFair: gc.GameServiceMessage.ProvablyFair) {
        const guideUrl = UrlUtils.getSubDomain(this.url);
        this.onWebViewLoaded = () => {
            (document.getElementById("webview") as HTMLIFrameElement)?.contentWindow?.postMessage(JSON.stringify(provablyFair), guideUrl);
        };
    }

    @render(PFVerification.WebViewPFVerificationStore, (store) => store.url)
    loadVerificationGuide(url: string) {
        if (url) {
            this.url = url;
            this.sendDataToIframe(this.provablyFair);
            this.loadWebView();
        }
    }
    loadWebView() {
        if (this.url) {
            this.showLoading();
            this.hideWebView();

            this.webView.url = this.url;
        }
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    onClickClose() {
        this.closeVerificationPopup();
    }

    @handle(gc.PFVerification.WebViewPFVerificationHandlers.VerificationPopupHandler)
    closeVerificationPopup() {
        return false;
    }
}
