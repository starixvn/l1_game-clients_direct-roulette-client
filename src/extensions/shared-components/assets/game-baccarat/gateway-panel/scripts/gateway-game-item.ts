import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { GatewayPanelStore } from "./gateway-panel-store";
import { GameData } from "./models/game-data";
import { GameDataBase } from "./models/game-data-base";
import RenderItem from "./render-item/render-item";
const { ccclass, property } = _decorator;
const { handle } = Observer;
@ccclass
export default class GatewayGameItem extends ObserverComponent {
    @property(Label)
    labelGameName: Label = null;

    @property(Node)
    loading: Node = null;

    renderItems: RenderItem[] = [];
    gameId = 0;
    gameName = "";

    gameData: GameData = null;

    initRenderItems() {
        this.renderItems = this.getComponentsInChildren(RenderItem);
        this.renderItems.forEach((item) => item.init(this.gameData));
    }

    init(settings: { gameId: number; gameName: string; gameData: GameDataBase }) {
        const { gameId, gameName, gameData } = settings;
        this.gameId = gameId;
        this.gameName = gameName;
        this.gameData = gameData;
        this.updateGameName(this.gameId);
        this.initRenderItems();
    }

    onDestroy() {
        this.gameData = null;
        super.onDestroy();
    }

    getDisplayName() {
        return gc.Translator.translate(`${this.gameName}.game_name`);
    }

    async updateGameName(gameId: number) {
        try {
            this.labelGameName.string = this.getDisplayName();
            if (this.labelGameName.string === "") {
                this.labelGameName.string = `Game___${gameId}`;
            }
        } catch (e) {}
    }

    @handle(GatewayPanelStore, (store, gameId: number) => store.callGameSignIn(gameId))
    callGameSignIn() {
        return this.gameId;
    }

    onReconnectGame() {
        this.callGameSignIn();
    }

    @handle(gc.App.AppHandlers.BackToOperatorLobby, (handler, gameId: number) => handler.handleOpenGame(gameId))
    onClickOpenGame() {
        this.gameData.clearStoreListeners();
        return this.gameId;
    }
}
