import gc from "@sg/game-client-base";
import { _decorator, Label, Node, tween, UIOpacity, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import EffectAppearanceLabel from "./effect-appearance-label";
import { Md5CopyButton } from "./md5-copy-button";
import MD5Tip from "./md5-tip";

const { render } = Observer;
const { Rounds, Settlements, Translator } = gc;

const { ccclass, property } = _decorator;

export type MD5Type = {
    extraInfos: any;
    rawValue: string;
    hashValue: string;
};
@ccclass
export default class MD5Component extends ObserverComponent {
    @property(Label)
    lblCaption: Label = null;

    @property(EffectAppearanceLabel)
    lblMd5Value: EffectAppearanceLabel = null;

    @property(Node)
    nodeCopyButton: Node = null;

    @property(Node)
    nodeContentContainer: Node = null;

    @property
    lengthOfMd5 = 21;

    @property(MD5Tip)
    protected md5Tip: MD5Tip = null;

    @property
    maximumStringAllowed = 32;
    protected lblHint: Label = null;
    protected tipString: string;
    private md5CopyString: string = null;
    private resultHash: gc.GameServiceMessage.ResultHash = null;
    private md5CopyButton: Md5CopyButton = null;

    onLoad() {
        super.onLoad();
        this.registerTouchEvents();
        this.hideTooltip();
        this.updateTextCaption(false);
        this.nodeCopyButton && (this.md5CopyButton = this.nodeCopyButton.getComponent(Md5CopyButton));
    }

    onDestroy(): void {
        super.onDestroy();
    }

    private registerTouchEvents() {
        this.nodeContentContainer?.on(Node.EventType.MOUSE_ENTER, this.showTooltip, this);
        this.nodeContentContainer?.on(Node.EventType.MOUSE_LEAVE, this.hideTooltip, this);
        this.nodeContentContainer?.on(Node.EventType.TOUCH_START, this.showTooltip, this);
    }

    protected showTooltip() {
        if (this.tipString && this.md5Tip) {
            this.md5Tip.setData(this.tipString);
            this.md5Tip.show(true);
            tween(this.md5Tip.node.getComponent(UIOpacity)).to(0.2, { opacity: 255 }).delay(2).to(0.1, { opacity: 0 }).start();
        }
    }

    private hideTooltip() {
        this.md5Tip?.show(false);
    }

    @render(Rounds.RoundStore, (store) => store.resultHash, { fireImmediately: false })
    private renderMd5(resultHash: gc.GameServiceMessage.ResultHash) {
        if (resultHash) {
            this.resultHash = resultHash;
            !this.lblMd5Value?.string && this.handleMD5Data(resultHash);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    private updateMd5String(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.resultHash && this.handleMD5Data(this.resultHash);
    }

    @render(Settlements.SettlementStore, (store) => store.isFinishedShowResult)
    private updateMd5Result(isFinishedShowResult: boolean) {
        isFinishedShowResult && this.resultHash && this.handleMD5Data(this.resultHash);
    }

    private handleMD5Data(data: gc.GameServiceMessage.ResultHash) {
        this.setDataTip(data);
        if (this.node?.isValid) {
            this.updateTextCaption(!!data?.rawValue);
            this.generateMD5Result(data);
            this.setCopyString(data?.hashValue || data?.rawValue);
        }
    }

    generateMD5Result(data: gc.GameServiceMessage.ResultHash) {
        const value = data?.hashValue || data?.rawValue;
        const formatValue = value.length > this.maximumStringAllowed ? value.slice(0, this.lengthOfMd5) + "..." : value;
        this.lblMd5Value && (this.lblMd5Value.string = `${formatValue}`);
    }

    private resetMd5() {
        this.lblMd5Value && (this.lblMd5Value.string = "");
        this.tipString = "";
        this.setCopyString("");
    }

    private setCopyString(text: string) {
        this.md5CopyString = text;
    }

    protected setDataTip(data: gc.GameServiceMessage.ResultHash) {
        this.tipString = data.rawValue || data.hashValue;
    }

    async onClickCopyButton() {
        this.md5CopyButton.isCopying = true;
        this.md5Tip.show(false);
        const isSuccessful = await gc.GameUtils.copyToClipboard(this.md5CopyString);
        if (isSuccessful) {
            this.md5CopyButton?.showHint(true);
        }
    }

    private updateTextCaption(isMD5Key: boolean) {
        this.lblCaption.string = Translator.commonTranslate(isMD5Key ? "md5_result" : "md5_key");
        this.lblCaption.node.position = v3(-5, 0, 0);
        tween(this.lblCaption.node)
            .to(0.3, { position: v3(0, 0, 0) })
            .start();
    }
}
