import { Store } from "../models/definitions";
import { GameInfoStore } from "../models/game-info-store";
import { BaseEventHandler } from "./base-event-handler";
interface GameInfoType {
    totalOnlineUsers?: number;
    remainingTime?: number;
    rtp?: number;
    betLimit?: { minBet: number; maxBet: number };
    player: any;
    outgame: any;

    newShoePhase?: boolean;
    newShoeHash?: string;
    newBlockchain?: any;
}
export class GameInfoHandler extends BaseEventHandler<any> {
    protected verifyEvent(event: GameInfoType): boolean {
        return true;
    }

    protected handle(data: GameInfoType) {
        const store = this.gameData.getStore(Store.GameInfo) as GameInfoStore;

        if (data.totalOnlineUsers !== undefined) {
            store.changeOnlineUsers(data.totalOnlineUsers);
        }
        if (data.remainingTime !== undefined) {
            store.receiveTimeRemaining(data.remainingTime);
        }
        if (data.rtp !== undefined) {
            store.changeRtp(data.rtp);
        }
        if (data.betLimit !== undefined) {
            store.changeBetLimit(data.betLimit);
        }
        if (data.player !== undefined) {
            store.increaseOnlineUser();
        }
        if (data.outgame !== undefined) {
            store.decreaseOnlineUser();
        }
        if (data.newShoePhase || data.newShoeHash || data.newBlockchain) {
            store.setNewShoe(true);
        }
    }
}
