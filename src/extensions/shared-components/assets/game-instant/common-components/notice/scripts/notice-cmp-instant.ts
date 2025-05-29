import gc from "@sg/game-client-base";
import { Label, Node, Sprite, SpriteFrame, _decorator } from "cc";
import { NoticeCmp } from "../../../../shared/common-components/notice/scripts/notice-cmp";
const { ccclass, property } = _decorator;

const { AppTypes, BrowserDomUtils } = gc;

@ccclass("NoticeCmpInstant")
export class NoticeCmpInstant extends NoticeCmp {
    @property({ override: true, visible: false })
    containerBackground: Sprite = null;

    @property({ override: true, visible: false })
    lblTitle: Label = null;

    @property({ override: true, visible: false })
    errorBackground: SpriteFrame = null;

    @property({ override: true, visible: false })
    infoBackground: SpriteFrame = null;

    @property({ override: true, visible: false })
    btnConfirm: Node = null;

    onOutsideClick() {
        switch (this.noticeInfo) {
            case gc.Notices.NoticeInfo.ApiError:
                this.hide();
                break;
            case gc.Notices.NoticeInfo.NotificationReload:
                this.onClose();
                this.hide();
                break;
            case gc.Notices.NoticeInfo.DisabledAccount:
            case gc.Notices.NoticeInfo.SessionTimeout:
                this.onClose();
                break;
            case gc.Notices.NoticeInfo.ExcludedGame:
                BrowserDomUtils.postMessageToParent({ isNotPermittedToPlay: true });
                break;

            default:
                break;
        }
    }
}
