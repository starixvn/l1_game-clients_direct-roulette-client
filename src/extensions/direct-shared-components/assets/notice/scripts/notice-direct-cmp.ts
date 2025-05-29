import { Button, _decorator } from "cc";
const { ccclass } = _decorator;

import gc from "@sg/game-client-base";
import LocalizedLabelWithFormat from "db://i18n/LocalizedLabelWithFormat";
import { NoticeCmp, NoticeType } from "db://shared-components/shared/common-components/notice/scripts/notice-cmp";

const { BrowserDomUtils } = gc;

@ccclass()
export class NoticeDirectCmp extends NoticeCmp {
    setData(data: {
        title: string;
        message: string;
        type: NoticeType;
        onClose: () => void;
        showBtnConfirmButton?: boolean;
        noticeInfo?: gc.Notices.NoticeInfo;
    }) {
        const modifiedData = { ...data };

        if (this.isBlockingNotice(modifiedData.noticeInfo)) {
            this.disableBackgroundClick();
        }

        if (data.noticeInfo === gc.Notices.NoticeInfo.DisabledGame) {
            modifiedData.showBtnConfirmButton = false;
            modifiedData.onClose = () => {};
        }

        if (data.noticeInfo === gc.Notices.NoticeInfo.ExcludedGame) {
            const originalOnClose = modifiedData.onClose;
            modifiedData.onClose = () => {
                BrowserDomUtils.postMessageToParent({ isNotPermittedToPlay: true });
                originalOnClose();
            };
        }

        this.updateButtonLabel(modifiedData.noticeInfo);

        super.setData(modifiedData);
    }

    private isBlockingNotice(noticeInfo?: gc.Notices.NoticeInfo): boolean {
        return noticeInfo === gc.Notices.NoticeInfo.DisabledGame || noticeInfo === gc.Notices.NoticeInfo.LostGameConnection;
    }

    private disableBackgroundClick(): void {
        const bgCpm = this.nodeFadeBackground?.getComponent(Button);
        if (bgCpm) {
            bgCpm.clickEvents = [];
        }
    }

    private updateButtonLabel(noticeInfo?: gc.Notices.NoticeInfo): void {
        if (noticeInfo === gc.Notices.NoticeInfo.LostGameConnection) {
            const lblButton = this.btnConfirm?.getComponentInChildren(LocalizedLabelWithFormat);
            if (lblButton) {
                lblButton.key = "Common.reconnect";
                lblButton.updateLabel();
            }
        }
    }
}
