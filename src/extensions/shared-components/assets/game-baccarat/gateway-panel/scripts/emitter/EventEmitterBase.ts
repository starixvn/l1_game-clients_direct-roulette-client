import { EventTarget } from "cc";
export default class EventEmitterBase extends EventTarget {
    private _eventStorages: { event; listener }[] = [];

    addListener<TFunction extends (...any: any[]) => void>(event: string, listener: TFunction, target, managed = true) {
        this.on(event, listener, target);
        managed && this._eventStorages.push({ event, listener });
    }

    removeListener<TFunction extends (...any: any[]) => void>(event: string, listener: TFunction) {
        this.off(event, listener);
        this._eventStorages.splice(
            this._eventStorages.findIndex((item) => item.event === event && item.listener === listener),
            1
        );
    }
    updateUI() {}

    clearAllListeners() {
        this._eventStorages.forEach((item) => {
            this.off(item.event, item.listener);
        });
        this._eventStorages = [];
    }
}
