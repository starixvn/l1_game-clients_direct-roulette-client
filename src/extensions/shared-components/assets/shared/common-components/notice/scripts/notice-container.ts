import gc from "@sg/game-client-base";
import { _decorator, game } from "cc";
import { GameGuideUtils } from "db://shared-components/game/game-guide/scripts/utils/game-guide-utils";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { NoticeCmp } from "./notice-cmp";

const { render } = Observer;

const { Notices, DisabledGame } = gc;
const { ccclass } = _decorator;

@ccclass("NoticeContainer")
export class NoticeContainer extends NodeContainer {
    noticeCmp: NoticeCmp = null;

    private async showNoticeComponent(notice: gc.Notices.Notice) {
        await GameGuideUtils.hideWebViewGuide();
        const node = this.createNode();
        this.noticeCmp = node.getComponent<NoticeCmp>(NoticeCmp);
        this.noticeCmp.setData(notice);
    }

    @render(Notices.NoticeStore, (store) => store.notice, { fireImmediately: false })
    async showNotice(notice: gc.Notices.Notice) {
        if (!game.isPaused() && notice) {
            await this.showNoticeComponent(notice);
        }
    }

    @render(DisabledGame.DisabledGameStore, (store) => store.noticeDisable)
    async renderUMNotice(noticeDisable: gc.Notices.Notice) {
        if (!noticeDisable) {
            this.noticeCmp?.hide();
            return;
        }

        if (!this.noticeCmp?.node) {
            await this.showNoticeComponent(noticeDisable);
        }
    }
}
