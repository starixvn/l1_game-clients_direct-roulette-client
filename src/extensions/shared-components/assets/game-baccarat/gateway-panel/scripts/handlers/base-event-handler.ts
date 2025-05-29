import { GameDataBase } from "../models/game-data-base";

export class BaseEventHandler<Event> {
    protected readonly gameData: GameDataBase;

    constructor(gameData: GameDataBase) {
        this.gameData = gameData;
    }

    onReceiveEvent(event: Event) {
        if (this.verifyEvent(event)) {
            this.handle(event);
        }
    }

    protected verifyEvent(event: Event): boolean {
        return true;
    }

    protected handle(event: Event) {
        // handle
    }
}
