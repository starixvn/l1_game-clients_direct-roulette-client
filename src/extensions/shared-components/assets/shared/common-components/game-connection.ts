import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "./observer-component/scripts/observer-component";
import { siteConfigs } from "../../../../../assets/scripts/site-configs";

const { ccclass } = _decorator;
const { handle, render } = Observer;

const { Auth, AppTypes } = gc;

@ccclass
export default class GameConnection extends ObserverComponent {
    protected system: number = AppTypes.Club;
    protected isMiniGame: boolean = false;
    openGameCallback = () => {};

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {
        return { ...siteConfigs?.websocketOptions };
    }

    @render(gc.JoinGame.JoinGameStore, (store) => store.toGame, { fireImmediately: false })
    requestOpenGame() {
        this.openGameCallback();
    }

    @render(Auth.AuthStore, (store) => store.system)
    openGame(system: number) {
        this.system = system;
    }

    @render(gc.GameConfigs.GameSetting, (gameSetting) => gameSetting.isMiniGame)
    setMiniGame(isMiniGame: boolean) {
        this.isMiniGame = isMiniGame;
    }

    @render(gc.JoinGame.JoinGameStore, (store) => store.signedIn, { fireImmediately: false })
    requestOpenMiniGame() {
        if (this.isMiniGame) {
            this.openGameCallback();
        }
    }
}
