import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class LogStore {
    @inject(gc.GameConfigs.GameSetting)
    protected readonly gameSetting: gc.GameConfigs.GameSetting;

    @inject(gc.Rounds.RoundStore)
    protected readonly roundStore: gc.Rounds.RoundStore;

    @inject(gc.Rounds.RoundTimeStore)
    protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get message() {
        if (!this.gameSetting || !this.roundStore || !this.roundTimeStore) {
            return "";
        }

        return `${this.gameSetting?.name}: RoundId: ${this.roundStore?.roundId} Round Time: ${this.roundTimeStore?.roundTime}, State: ${this.roundTimeStore?.roundState}`;
    }
}
