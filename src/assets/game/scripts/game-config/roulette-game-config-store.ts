import inversify from "inversify";
import mobx from "mobx";

const { injectable } = inversify;
const { makeAutoObservable } = mobx;

@injectable()
export class RouletteGameConfigStore {
    // Roulette currently doesn't require game-specific configurations
    // This store is kept for consistency and potential future expansion
    
    constructor() {
        makeAutoObservable(this);
    }
}
