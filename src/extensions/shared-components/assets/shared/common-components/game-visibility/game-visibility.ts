import { _decorator, Game, game } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../observer-component/scripts/observer-component";
import { GameVisibilityStore } from "./game-visibility-store";
const { ccclass, property } = _decorator;
const { handle } = Observer;
@ccclass("GameVisibility")
export class GameVisibility extends ObserverComponent {
    onLoad() {
        this.registerEventShowHideGame();
        super.onLoad();
    }

    protected start(): void {
        this.setGameVisibility(true);
    }

    onDestroy(): void {
        this.clearEventShowHideGame();
        super.onDestroy();
    }

    private registerEventShowHideGame() {
        game.on(Game.EVENT_HIDE, this.onHideGame, this);
        game.on(Game.EVENT_SHOW, this.onShowGame, this);
    }

    private clearEventShowHideGame() {
        game.off(Game.EVENT_HIDE, this.onHideGame, this);
        game.off(Game.EVENT_SHOW, this.onShowGame, this);
    }

    private onHideGame() {
        this.setGameVisibility(false);
    }

    private onShowGame() {
        this.setGameVisibility(true);
    }

    @handle(GameVisibilityStore, (store, visible) => store.changeVisibility(visible))
    setGameVisibility(visible: boolean) {
        return visible;
    }
}
