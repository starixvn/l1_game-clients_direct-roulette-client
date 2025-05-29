// import NoticeUtil from "../../../common/utils/NoticeUtil";
import { AppUtils } from "../../../../shared/utils";
import { Store } from "../models/definitions";
import { DisableGameStore } from "../models/disable-game-store";
import { BaseEventHandler } from "./base-event-handler";
interface DisableGameEvent {
    um?: boolean;
    um_message?: string;
    errorCode?: string;
    remainingTime?: number;
}
export class DisableGameHandler extends BaseEventHandler<any> {
    protected verifyEvent(event: DisableGameEvent): boolean {
        return (
            event.um !== undefined || event.um_message !== undefined || event.errorCode !== undefined || event.remainingTime !== undefined
        );
    }

    protected handle(data: DisableGameEvent) {
        const store = this.gameData.getStore(Store.DisableGame) as DisableGameStore;
        if (data.um !== undefined) {
            store.setConnectionError(false);
            store.setDisabledGame(data.um);
            if (data.um_message) {
                const dataText = data.um_message;
                const locale = AppUtils.getLocale();
                const message = dataText[locale] ?? dataText[AppUtils.DEFAULT_LOCALE];
                store.setUmMessage(message);
            }
        }

        if (data.remainingTime !== undefined) {
            store.clearIntervalGetLobbyData();
            store.setDisabledGame(false);
            store.setConnectionError(false);
        }

        if (data.errorCode === "SB0010") {
            store.setConnectionError(true);
        }
    }
}
