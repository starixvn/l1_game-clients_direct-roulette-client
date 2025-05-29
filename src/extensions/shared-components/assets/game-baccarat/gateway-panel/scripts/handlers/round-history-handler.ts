import { Store } from "../models/definitions";
import { GameInfoStore } from "../models/game-info-store";
import { RoundHistoryStore } from "../models/round-history-store";
import { BaseEventHandler } from "./base-event-handler";
interface RoundHistoryType {
    roundHistory?: any[];
    finish?: any;
    newShoeHash?: string;
    newShoePhase?: boolean;
    newBlockchain?: any;
}
export class RoundHistoryHandler extends BaseEventHandler<any> {
    protected verifyEvent(event: RoundHistoryType): boolean {
        return !!event.roundHistory || !!event.finish || !!event.newShoeHash || !!event.newBlockchain;
    }

    protected handle(data: RoundHistoryType) {
        const store = this.gameData.getStore(Store.RoundHistory) as RoundHistoryStore;
        const lastRound = store.roundHistory[0];
        if (data.roundHistory) {
            const roundHistory = data.roundHistory;
            if (roundHistory[0] && lastRound && roundHistory[0].roundId < lastRound.roundId) {
                roundHistory.unshift(...store.roundHistory);
            } else {
                roundHistory.push(...store.roundHistory);
            }
            store.roundHistory = roundHistory.filter(
                (round, index, histories) => histories?.findIndex((history) => +history.roundId === +round.roundId) === index
            );
            store.updateUI();
        }

        if (data.newShoePhase || data.newShoeHash || data.newBlockchain) {
            store.roundHistory = [];
            store.updateUI();
        }

        if (data.finish) {
            const newRoundId = data.finish.roundId;

            if (lastRound && lastRound.roundId >= newRoundId) {
                return;
            }
            store.roundHistory.unshift(data.finish);

            const infoStore = this.gameData.getStore(Store.GameInfo) as GameInfoStore;
            const generatingResult = infoStore.durations.generatingResult;
            setTimeout(() => {
                store?.updateUI();
            }, generatingResult * 1000);
        }
    }
}
