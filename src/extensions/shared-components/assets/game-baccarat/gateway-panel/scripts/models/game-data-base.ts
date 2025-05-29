import EventEmitterBase from "../emitter/EventEmitterBase";
import { BaseEventHandler } from "../handlers/base-event-handler";
import { StoreBase } from "./definitions";
export abstract class GameDataBase extends EventEmitterBase {
    protected readonly stores: StoreBase[] = [];
    protected readonly eventHandlers: BaseEventHandler<any>[] = [];
    abstract getStore(storeName: string): StoreBase;
    abstract initHandlers(handlers: any[]): void;
    abstract addStores(stores: StoreBase[]): void;
    abstract receiveData(data: unknown): void;
    abstract reset(): void;
    abstract clearStoreListeners(): void;
}
