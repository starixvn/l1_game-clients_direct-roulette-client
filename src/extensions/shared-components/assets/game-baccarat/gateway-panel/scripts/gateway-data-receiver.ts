import gc from "@sg/game-client-base";
import { _decorator, instantiate, JsonAsset, log, Prefab, warn } from "cc";
import { InGameMenuStore } from "db://shared-components/game/in-game-menu/scripts/stores/in-game-menu-store";
import Observer from "observer";
import { Socket } from "socket.io-client/dist/socket.io.js";
import { siteConfigs } from "../../../../../../assets/scripts/site-configs";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { AppUtils, FunctionUtils } from "../../../shared/utils";
import { GatewayPanel } from "./gateway-panel";
import { GatewayPanelStore } from "./gateway-panel-store";
import { DisableGameHandler } from "./handlers/disable-game-handler";
import { GameInfoHandler } from "./handlers/game-info-handler";
import { RoundHistoryHandler } from "./handlers/round-history-handler";
import { EmitterEvents, OpenSidePanelEvent } from "./models/definitions";
import { DisableGameStore } from "./models/disable-game-store";
import { GameData } from "./models/game-data";
import { GameInfoStore } from "./models/game-info-store";
import { RoundHistoryStore } from "./models/round-history-store";
import { GoodRoadCounterHandler } from "./settings/good-road-counter-handler";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

interface IGatewayConfigs {
    gameId: number;
    games: Record<number, string[]>;
    durations: {
        default: IDurationDetails;
        speed: IDurationDetailsWithIds;
        blockchain: IDurationDetailsWithIds;
    };
    serviceName: {
        default: IServiceNameDetails;
        old: IServiceNameDetailsWithIds;
        blockchain: IServiceNameDetailsWithIds;
    };
    receivedEvents: string[];
}

interface IDurationDetails {
    value: IDurationValues;
}

interface IDurationDetailsWithIds extends IDurationDetails {
    ids: number[];
}

interface IDurationValues {
    wholeRound: number;
    wholeShoe: number;
    lockingBet: number;
    placingBet: number;
    generatingResult: number;
    showingResult: number;
    startRound: number;
}

interface IServiceNameDetails {
    value: string;
}

interface IServiceNameDetailsWithIds extends IServiceNameDetails {
    ids: number[];
}

@ccclass("GatewayDataReceiver")
export class GatewayDataReceiver extends ObserverComponent {
    @property(Prefab)
    panelPrefab: Prefab = null;

    @property(GoodRoadCounterHandler)
    goodRoadCounterHandler: GoodRoadCounterHandler = null;

    socket: Socket = null;

    gatewayConfig: IGatewayConfigs = null;

    rtps: { [gameId: number]: number } = {};
    dataGames = {}; //gameId : gameData
    gameId = -1;
    lobbyId = -1;
    offerGames = [];

    @render(gc.Player.MainPlayerStore, (store) => store.offerGames)
    renderOfferGames(offerGames: any[]) {
        if (offerGames) {
            this.offerGames = offerGames.map((item) => item.gameId);
        }
    }

    @render(gc.GameConfigs.GameSetting, (store) => store.lobbyId)
    renderLobbyId(lobbyId: number) {
        this.lobbyId = lobbyId;
        this.getGatewayConfig().then(() => {
            this.createDefaultRTP();
            this.createGameDatas();
            this.initGoodRoadCounterHandler();
            this.initSocket();
        });
    }

    createDefaultRTP() {
        const games = this.getFilterGames();
        for (const gameId of games) {
            this.rtps[gameId] = 98;
        }
        this.updateRTPOrderGameIds();
    }

    private initSocket() {
        const socketUri = gc.UrlUtils.buildUrlFromSubDomain(siteConfigs, siteConfigs?.gatewaySubDomain);
        this.socket = gc.SocketUtils.createSocket(socketUri, siteConfigs);
        this.socket.on("connect", () => {
            this.socket.onAny(this.filterDataGame);
            this.sendSignInAllGames();
        });
    }

    async getGatewayConfig() {
        try {
            const configUrl = `${gc.UrlUtils.buildShareResource(siteConfigs)}/gateway/${this.lobbyId}/info.json?v=${Date.now()}`;
            const jsonAsset = (await FunctionUtils.loadRemote(configUrl)) as JsonAsset;
            this.gatewayConfig = (jsonAsset?.json as IGatewayConfigs) ?? null;
        } catch (error) {
            log("Get Gateway config failed!");
        }
    }

    @render(gc.GameConfigs.GameSetting, (store) => store.id)
    renderGameId(gameId: number) {
        this.gameId = gameId;
    }

    getFilterGames() {
        if (this.offerGames.length === 0) {
            warn("offerGames is empty!");
            return [];
        }
        const games = Object.keys(this.gatewayConfig?.games)
            .map((gameId) => +gameId)
            .filter((gameId) => gameId !== this.gameId && this.offerGames.includes(gameId));
        return games;
    }

    createGameDatas() {
        const games = this.getFilterGames();
        games.forEach((gameId) => {
            this.dataGames[gameId] = this.createGameData(gameId);
        });
    }

    initGoodRoadCounterHandler() {
        this.goodRoadCounterHandler.init(this.dataGames);
    }

    createGameData(gameId: number) {
        const durations = this.getDurations(gameId);
        const gameData = new GameData();
        gameData.initHandlers([RoundHistoryHandler, GameInfoHandler, DisableGameHandler]);

        const infoStore = new GameInfoStore();
        infoStore.durations = durations;
        const disableGameStore = new DisableGameStore();
        disableGameStore.addListener(EmitterEvents.GetLobbyData, () => this.sendSignInEachGame(gameId), this);
        gameData.addStores([new RoundHistoryStore(), infoStore, disableGameStore]);
        return gameData;
    }

    filterDataGame = (event: string, data: any) => {
        const eventLowerCase = event.toLocaleLowerCase();

        if (eventLowerCase === "message") {
            const gameName = data.gameName?.toLocaleLowerCase();
            this.onData(data, gameName);
        } else {
            this.onData(data, eventLowerCase);
        }
    };

    onData(data: any, gameName: string) {
        if (data.signedIn) {
            this.onSignedIn(gameName);
            return;
        }
        const gameId = this.convertGameNameToId(gameName);
        this.handleDataRtp(data, gameId);
        this.publishDataEachGame(data, gameId);
    }

    convertGameNameToId(gameName: string) {
        const games = this.getFilterGames();
        return games.find((gameId) => this.getGameName(gameId).toLowerCase() === gameName);
    }

    publishDataEachGame(data: any, gameId: number) {
        const gameData = this.dataGames[gameId];
        if (gameData) {
            gameData.receiveData(data);
        }
    }

    handleDataRtp(data: any, gameId: number) {
        if (data.rtp) {
            this.rtps[gameId] = data.rtp;

            this.updateRTPOrderGameIds();
        }
    }

    @handle(GatewayPanelStore, (store, gameIds: number[]) => store.updateOrderGameIds(gameIds))
    updateRTPOrderGameIds() {
        const gameIds = this.getFilterGames();
        gameIds.sort((a, b) => this.rtps[b] - this.rtps[a]);
        return gameIds;
    }

    sendSignInAllGames() {
        const games = this.getFilterGames();
        games.forEach((gameId) => {
            this.sendSignInEachGame(+gameId);
        });
    }

    getGameName(gameId: number) {
        if (gameId === 27) {
            return "VipBaccarat";
        }
        if (gameId === 48) {
            return "BlockchainBaccarat";
        }
        return `Bac${gameId}`;
    }

    getSession() {
        const sessionStorage = AppUtils.getSession() as any;
        return sessionStorage
            ? {
                  ss: sessionStorage.session,
                  username: sessionStorage.username,
                  system: sessionStorage.system,
              }
            : {};
    }

    getServiceName(gameId: number) {
        const info = this.gatewayConfig?.serviceName;
        const type = Object.keys(info).find((key) => info[key].ids?.includes(gameId)) ?? "default";
        return info[type].value;
    }

    getDurations(gameId: number) {
        const info = this.gatewayConfig?.durations;
        const type = Object.keys(info).find((key) => info[key].ids?.includes(gameId)) ?? "default";
        return info[type].value;
    }

    getCategory(gameId: number) {
        return this.gatewayConfig?.games[gameId];
    }

    sendSignInEachGame(gameId: number) {
        const data = {
            gameName: this.getGameName(gameId),
            receivedEvents: this.gatewayConfig?.receivedEvents,
            session: this.getSession(),
        };
        const serviceName = this.getServiceName(gameId);
        if (serviceName !== "") {
            data["serviceName"] = serviceName;
        }
        this.socket.emit("signIn", data);
    }

    onSignedIn(gameName: string) {
        this.getLobbyData(gameName);
    }

    getLobbyData(gameName: string) {
        this.socket.emit("getLobbyData", { gameName: gameName });
    }

    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    renderInGameMenuStore({ event }: { event: string }) {
        if (event === OpenSidePanelEvent) {
            this.onOpenSidePanel();
        }
    }

    onOpenSidePanel() {
        const node = instantiate(this.panelPrefab);

        const panel = node.getComponent(GatewayPanel);

        const games = this.getFilterGames();
        const info = {};
        games?.forEach((gameId) => {
            const gameName = this.getGameName(gameId);
            info[gameId] = {
                gameName,
                categories: this.getCategory(gameId),
            };
        });

        panel.initItems(this.dataGames, info);
        this.node.addChild(node);
    }

    @render(GatewayPanelStore, (store) => store.eventGameSignIn, { fireImmediately: false })
    renderEventGameSignIn(event: { gameId: number }) {
        if (event.gameId) {
            this.sendSignInEachGame(event.gameId);
        }
    }
}
