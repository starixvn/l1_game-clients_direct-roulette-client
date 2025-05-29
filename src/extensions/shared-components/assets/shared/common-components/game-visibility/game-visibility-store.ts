import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class GameVisibilityStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    isVisible = false;

    changeVisibility(isVisible) {
        this.isVisible = isVisible;
    }
}
