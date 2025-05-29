import gc from "@sg/game-client-base";
import inversify from "inversify";

const { injectable, inject } = inversify;

@injectable()
export class DemoHandler implements gc.Shared.IHandler<gc.GameServiceMessage.GameConfigs> {
    @inject(gc.GameConfigs.GameConfigStore) private readonly gameConfig: gc.GameConfigs.GameConfigStore;

    handle(gameConfigs: gc.GameServiceMessage.GameConfigs) {
        this.gameConfig.setGameConfigs(gameConfigs);
    }
}
