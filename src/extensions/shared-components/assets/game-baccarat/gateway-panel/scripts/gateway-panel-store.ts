import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import SCScoreboard from "sc-scoreboards";
import {
    DEFAULT_PATTERNS,
    ONE_LOUNGE_2_ROOMS_BANKER,
    ONE_LOUNGE_2_ROOMS_PLAYER,
    PATTED_EAT_BANKER,
    PATTED_EAT_PLAYER,
    PING_PONG_BANKER,
    PING_PONG_PLAYER,
    STREAK_BANKER,
    STREAK_PLAYER,
} from "../../../game/scoreboards/scripts/components/baccarat/big-road/baccarat-big-road-good-road-patterns";
const {} = SCScoreboard;
const { injectable, inject } = inversify;

interface GoodRoadSettingStorage {
    selectedPatternFlag: { [key: string]: boolean };
    categoryFilter: string[];
    goodRoadFilter: boolean;
}

@injectable()
export class GatewayPanelStore {
    @inject(gc.GameConfigs.GameSetting) private readonly gameSetting: gc.GameConfigs.GameSetting;
    constructor() {
        mobx.makeAutoObservable(this);

        setTimeout(() => {
            this.initStore();
            this.syncStorage();
        }, 0);
    }
    readonly config = [
        { key: "streak_banker", pattern: STREAK_BANKER },
        { key: "streak_player", pattern: STREAK_PLAYER },

        { key: "ping_pong_banker", pattern: PING_PONG_BANKER },
        { key: "ping_pong_player", pattern: PING_PONG_PLAYER },

        { key: "patted_eat_banker", pattern: PATTED_EAT_BANKER },
        { key: "patted_eat_player", pattern: PATTED_EAT_PLAYER },

        { key: "one_lounge_two_bedrooms_banker", pattern: ONE_LOUNGE_2_ROOMS_BANKER },
        { key: "one_lounge_two_bedrooms_player", pattern: ONE_LOUNGE_2_ROOMS_PLAYER },
    ];
    patterns: SCScoreboard.ColumnLengthPattern[] = DEFAULT_PATTERNS;
    selectedPatternFlag = this.generateDefaultSelectedFlag();
    categoryFilter = [];
    allGamesFilter = false;
    counter = 0;
    goodRoads = [];
    eventGameSignIn = {};
    orderGameIds = [];

    get defaultOpenAllGameFilter() {
        return this.goodRoads.length === 0;
    }

    private get storageKey() {
        return `good-road-setting-${this.gameSetting.lobbyId}`;
    }

    async syncStorage() {
        try {
            const storage = await gc.CrossStorageUtils.get(this.storageKey, true);
            if (storage) {
                this.initStore();
            }
        } catch (e) {
            console.log(e);
        }
    }

    initStore() {
        const storage = gc.StorageManager.get(this.storageKey, true) as GoodRoadSettingStorage;
        if (!storage) {
            return;
        }
        const { selectedPatternFlag, goodRoadFilter, categoryFilter } = storage;
        if (selectedPatternFlag) {
            this.updateSelectedPatterns(selectedPatternFlag, false);
        }

        this.allGamesFilter = goodRoadFilter ?? true;
        if (categoryFilter) {
            this.categoryFilter = categoryFilter;
        }
    }

    generateDefaultSelectedFlag() {
        const flag = {};
        this.config.forEach((item) => {
            flag[item.key] = true;
        });

        return flag;
    }

    onChangePatterns(selectedFlag: { [key: string]: boolean }) {
        this.updateSelectedPatterns(selectedFlag, true);
    }

    updateSelectedPatterns(selectedFlag: { [key: string]: boolean }, saveStorage = true) {
        this.selectedPatternFlag = selectedFlag;
        this.updatePatterns();
        if (saveStorage) {
            this.saveStorage();
        }
    }

    saveStorage() {
        const data = {
            selectedPatternFlag: mobx.toJS(this.selectedPatternFlag),
            goodRoadFilter: this.allGamesFilter,
            categoryFilter: mobx.toJS(this.categoryFilter),
        };
        gc.CrossStorageUtils.set(this.storageKey, data, true);
    }

    updatePatterns() {
        this.patterns = Object.keys(this.selectedPatternFlag)
            .filter((key) => this.selectedPatternFlag[key])
            .map((key) => this.config.find((c) => key === c.key)?.pattern)
            .filter((pattern) => !!pattern);
    }

    setCounter(counter: number) {
        if (counter !== this.counter) {
            this.counter = counter;
        }
    }

    updateGoodRoadGames(goodRoadGames: { id: number; goodRoad: SCScoreboard.GoodRoad }[]) {
        goodRoadGames.sort((a, b) => {
            const getIndex = (goodRoad: SCScoreboard.GoodRoad) => {
                const index = this.config.findIndex((config) => goodRoad.name === config.pattern.name);
                return index;
            };

            return getIndex(a.goodRoad) - getIndex(b.goodRoad);
        });

        const goodRoads = goodRoadGames.map((game) => game.id);

        if (JSON.stringify(mobx.toJS(this.goodRoads)) !== JSON.stringify(goodRoads)) {
            this.goodRoads = goodRoads;
            this.setCounter(this.goodRoads.length);
        }
    }

    saveCategoryFilter(categoryFilter: string[]) {
        this.categoryFilter = categoryFilter;
        this.saveStorage();
    }

    saveAllGamesFilter(allGamesFilter: boolean) {
        this.allGamesFilter = allGamesFilter;
        this.saveStorage();
    }

    callGameSignIn(gameId: number) {
        this.eventGameSignIn = {
            gameId,
        };
    }

    updateOrderGameIds(orderGameIds: number[]) {
        this.orderGameIds = orderGameIds;
    }
}
