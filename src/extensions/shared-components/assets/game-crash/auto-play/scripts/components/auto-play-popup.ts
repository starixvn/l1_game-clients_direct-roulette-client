import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { RoundNumberItem } from "./round-number-item";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { GameCrash, Notices } = gc;

@ccclass
export class AutoPlayPopup extends ObserverComponent {
    @property(Node)
    nodeContent: Node = null;

    @property(Prefab)
    prfNoOfRound: Prefab = null;

    @render(GameCrash.AutoPlay.AutoPlayStore, (store) => store.roundsList)
    initContentRounds(roundsList: number[]) {
        this.nodeContent.destroyAllChildren();
        roundsList.forEach((round) => {
            const node = instantiate(this.prfNoOfRound);
            const roundNumber = node.getComponent(RoundNumberItem);
            roundNumber?.setValue(round);
            this.nodeContent.addChild(node);
        });
    }

    @render(GameCrash.AutoPlay.AutoPlayStore, (store) => store.selectedRoundOnPopup)
    renderSelectedRounds(noOfRounds: number) {
        this.nodeContent.children.forEach((child) => {
            const roundNumber = child.getComponent(RoundNumberItem);
            const selectedBg = roundNumber.value === noOfRounds;
            roundNumber.setSelectedRound(selectedBg);
        });
    }

    @render(GameCrash.AutoPlay.AutoPlayStore, (store) => store.isOpenAutoPlayPopup)
    setAutoPlayPopupVisibility(status: boolean) {
        this.node.active = status;
        status && this.closeOtherPopups();
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeOtherPopupsWithoutAutoPlay())
    closeOtherPopups() {}

    @handle(GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.closeAutoPlayPopup())
    onClickclosePopup() {
        this.playSoundClick();
    }

    @handle(GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.confirmRoundAndStart())
    onClickStartButton() {
        this.playSoundClick();
    }

    @render(Notices.NoticeStore, (store) => store.notice)
    withNoticesGameInfo(notice: any) {
        const isExcludedGameOrApiError =
            notice?.noticeInfo === Notices.NoticeInfo.ExcludedGame || notice?.noticeInfo === Notices.NoticeInfo.ApiError;

        if (isExcludedGameOrApiError) {
            this.handleAutoPlay();
        }
    }

    @handle(GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.cancelAutoPlay())
    handleAutoPlay() {}

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
