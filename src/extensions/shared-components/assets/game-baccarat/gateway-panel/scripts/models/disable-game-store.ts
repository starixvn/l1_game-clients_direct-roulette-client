import { EmitterEvents, Store, StoreBase } from "./definitions";

export interface RoundHistory {
    result: any;
    settlementResult: any;
    roundId: number;
}

export class DisableGameStore extends StoreBase {
    storeName = Store.DisableGame;
    disabledGame = false;
    umMessage = "";
    gameDisconnected = false;
    intervalGetLobbyData: NodeJS.Timer;

    reset() {
        this.disabledGame = false;
        this.umMessage = "";
        this.gameDisconnected = false;
        this.clearIntervalGetLobbyData();

        this.updateUI();
    }

    setDisabledGame(disable: boolean) {
        this.disabledGame = disable;
        this.emit(EmitterEvents.DisabledGame, this.disabledGame);

        if (disable) {
            this.startIntervalGetLobbyData();
        }
    }

    startIntervalGetLobbyData() {
        if (this.intervalGetLobbyData) {
            return;
        }
        this.intervalGetLobbyData = setInterval(() => {
            this.emit(EmitterEvents.GetLobbyData);
        }, 60 * 1000);
    }

    clearIntervalGetLobbyData() {
        this.intervalGetLobbyData && clearInterval(this.intervalGetLobbyData);
        this.intervalGetLobbyData = null;
    }

    setUmMessage(message: string) {
        this.umMessage = message;
        this.emit(EmitterEvents.UmMessage, this.umMessage);
    }

    setConnectionError(value: boolean) {
        this.gameDisconnected = value;
        this.emit(EmitterEvents.ConnectionFailed, value);
    }

    updateUI() {
        this.emit(EmitterEvents.DisabledGame, this.disabledGame);
        this.emit(EmitterEvents.UmMessage, this.umMessage);
        this.emit(EmitterEvents.ConnectionFailed, this.gameDisconnected);
    }
}
