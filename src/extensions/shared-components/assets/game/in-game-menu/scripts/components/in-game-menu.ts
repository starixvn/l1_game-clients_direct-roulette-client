import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ExpandableNode } from "../../../../shared/common-components/expandable-node/scripts/expandable-node";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { InGameMenuHandlers } from "../handlers/in-game-menu-handlers";
import { InGameMenuEvents } from "../stores/in-game-menu-events";
const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass("InGameMenu")
export class InGameMenu extends ObserverComponent {
    @property(ExpandableNode)
    expandableNode: ExpandableNode = null;

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    protected doCommons() {
        this.playSoundClick();
        this.expandableNode?.collapse();
    }

    @handle(InGameMenuHandlers)
    protected handleEvent(event: string) {
        return event;
    }

    onOpenHistory() {
        this.doCommons();
        this.handleEvent(InGameMenuEvents.OPEN_HISTORY);
    }

    onOpenGuide() {
        this.doCommons();
        this.handleEvent(InGameMenuEvents.OPEN_GUIDE);
    }

    onOpenTicketDetails() {
        this.doCommons();
        this.handleEvent(InGameMenuEvents.OPEN_TICKET_DETAIL);
    }

    onOpenStatistics() {
        this.doCommons();
        this.handleEvent(InGameMenuEvents.OPEN_STATISTIC);
    }

    onCloseGame() {
        this.doCommons();
        this.handleEvent(InGameMenuEvents.CLOSE_GAME);
    }

    @handle(gc.App.AppHandlers.BackToOperatorLobby)
    onGoToLobby() {
        this.doCommons();
        this.handleEvent(InGameMenuEvents.GO_TO_LOBBY);
    }

    @handle(gc.Orientation.OrientationHandler, (handler) => handler.changeOrientation())
    onChangeOrientation() {
        this.doCommons();
        this.handleEvent(InGameMenuEvents.CHANGE_ORIENTATION);
    }

    onChangeWinningNotification() {
        this.doCommons();
        this.handleEvent(InGameMenuEvents.CHANGE_WINNING_NOTIFICATION);
    }

    onChangeSwapCard() {
        this.doCommons();
        this.handleEvent(InGameMenuEvents.CHANGE_SWAP_CARD);
    }

    onOpenGuideScrollMd5() {
        this.doCommons();
        this.handleEvent(InGameMenuEvents.OPEN_GUIDE_SCROLL_MD5);
    }
}
