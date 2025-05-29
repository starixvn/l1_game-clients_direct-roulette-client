import inversify from "inversify";
import { InGameMenuStore } from "../stores/in-game-menu-store";
const { inject, injectable } = inversify;

@injectable()
export class InGameMenuHandlers {
    @inject(InGameMenuStore) private readonly inGameMenuStore: InGameMenuStore;

    handle(event: string) {
        this.inGameMenuStore.event = { event };
    }
}
