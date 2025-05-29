import { EmitterEvents, Store, StoreBase } from "./definitions";

export interface RoundHistory {
    result: any;
    settlementResult: any;
    roundId: number;
}

export class RoundHistoryStore extends StoreBase {
    storeName = Store.RoundHistory;
    roundHistory: RoundHistory[] = [];
    updateUI() {
        this.emit(EmitterEvents.RoundHistoryChange, this.roundHistory);
    }

    reset() {
        this.roundHistory = [];
        this.updateUI();
    }
}
