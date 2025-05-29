import { BaseEventHandler } from "../handlers/base-event-handler";
import { StoreBase } from "./definitions";
import { GameDataBase } from "./game-data-base";
export class GameData extends GameDataBase {
    protected readonly stores: StoreBase[] = [];
    protected readonly eventHandlers: BaseEventHandler<any>[] = [];

    initHandlers(handlers: any[]) {
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }

    addStores(stores: StoreBase[]) {
        this.stores.push(...stores);
    }

    getStore(storeName: string) {
        return this.stores.find((store) => store.storeName === storeName);
    }

    receiveData(data: unknown) {
        this.eventHandlers.forEach((handler) => handler.onReceiveEvent(data));
    }

    reset() {
        this.stores.forEach((store) => store.reset());
    }

    clearStoreListeners(): void {
        this.stores.forEach((store) => store.clearAllListeners());
    }
}
