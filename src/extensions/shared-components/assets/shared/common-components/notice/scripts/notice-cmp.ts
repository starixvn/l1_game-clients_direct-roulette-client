import { Label, Node, Sprite, SpriteFrame, _decorator } from "cc";
import { Dialog } from "../../dialogs/dialog";
const { ccclass, property } = _decorator;

import gc from "@sg/game-client-base";
import { GameGuideUtils } from "db://shared-components/game/game-guide/scripts/utils/game-guide-utils";

export enum NoticeType {
    Info = 0,
    Error = 1,
}

@ccclass()
export class NoticeCmp extends Dialog {
    @property(Sprite)
    containerBackground: Sprite = null;

    @property(Label)
    lblTitle: Label = null;

    @property(Label)
    lblMessage: Label = null;

    @property(SpriteFrame)
    errorBackground: SpriteFrame = null;

    @property(SpriteFrame)
    infoBackground: SpriteFrame = null;

    @property(Node)
    btnConfirm: Node = null;

    noticeInfo: gc.Notices.NoticeInfo;

    onClose: () => void;

    onHideComplete = () => {
        GameGuideUtils.showWebViewGuide();
    };

    setData(data: {
        title: string;
        message: string;
        type: NoticeType;
        onClose: () => void;
        showBtnConfirmButton?: boolean;
        noticeInfo?: gc.Notices.NoticeInfo;
    }) {
        this.lblTitle && (this.lblTitle.string = data.title.toUpperCase());
        this.lblMessage.string = data.message;
        this.onClose = data.onClose;
        this.updateDisplay(data.type, data.showBtnConfirmButton);
        this.noticeInfo = data.noticeInfo;
    }

    updateDisplay(type: NoticeType, showBtnConfirmButton = false) {
        const isInfo = type === NoticeType.Info;
        this.setBackground(isInfo);
        this.btnConfirm && (this.btnConfirm.active = showBtnConfirmButton || isInfo);
    }

    setBackground(isInfo: boolean) {
        if (!this.containerBackground) {
            return;
        }
        if (isInfo) {
            this.containerBackground.spriteFrame = this.infoBackground;
        } else {
            this.containerBackground.spriteFrame = this.errorBackground;
        }
    }

    onOkClick() {
        this.hide();
    }

    onDestroy() {
        this.onClose && this.onClose();
    }
}
