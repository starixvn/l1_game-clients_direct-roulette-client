import { IMultipleHandlers } from "@sg/game-client-base/dist/shared";
import inversify from "inversify";
import { GameServiceMessage } from "../game-messages";
import { RouletteGameConfigStore } from "./roulette-game-config-store";
const { injectable, inject } = inversify;
@injectable()
export class RouletteGameConfigHandlers implements IMultipleHandlers {
    @inject(RouletteGameConfigStore) protected readonly gameConfigStore: RouletteGameConfigStore;

    handleGameConfigs(gameConfigs: GameServiceMessage.RouletteGameConfigs) {
        this.gameConfigStore.multipliers = gameConfigs.multipliers;
    }
    eventHandleList = [
        {
            name: GameServiceMessage.RouletteGameConfigs.eventName,
            handle: this.handleGameConfigs,
        },
    ];
}
