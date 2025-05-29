import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

interface EventData {
    event: string;
}

@injectable()
export class InGameMenuStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _event: EventData = null;
    public get event(): EventData {
        return this._event;
    }
    public set event(value: EventData) {
        this._event = value;
    }
}
