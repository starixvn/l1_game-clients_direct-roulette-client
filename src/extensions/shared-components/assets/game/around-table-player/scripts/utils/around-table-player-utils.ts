import gc from "@sg/game-client-base";
import { find } from "lodash-es";
import { FunctionUtils } from "../../../../shared/utils";
import BetItem from "../../../bets/scripts/components/bet-item";
import { AroundTablePlayerComponent } from "../components/around-table-player-component";
import { IAroundTablePlayers, INewPlayerInfo } from "../stores/around-table-players-chip-store";
const { Shared } = gc;

export namespace AroundTablePlayerUtils {
    export const findIdleHiddenPlayer = (hiddenPlayers: IAroundTablePlayers[]) => {
        return hiddenPlayers.find((player) => player.idleCount <= AroundTablePlayerComponent.maxIdleCount);
    };

    export const findIdleRealPlayer = (realPlayers: IAroundTablePlayers[]) => {
        return realPlayers.find((player) => player.idleCount <= AroundTablePlayerComponent.maxIdleCount);
    };

    export const getBotAroundTablePlayerComps = (playersComponent: AroundTablePlayerComponent[]): AroundTablePlayerComponent[] => {
        return playersComponent.filter((player) => player?.aroundTablePlayer?.type);
    };

    export const getRealPlayer = (hiddenPlayers: IAroundTablePlayers[]): IAroundTablePlayers[] => {
        return hiddenPlayers.filter((player) => player && !player.type);
    };

    export const getAroundTablePlayerSlot = (
        playersComponent: AroundTablePlayerComponent[],
        playerId: string
    ): AroundTablePlayerComponent => {
        return find(
            playersComponent,
            (player: AroundTablePlayerComponent) => player.aroundTablePlayer && player.aroundTablePlayer?.id === playerId
        );
    };

    export const getPlayerFromCache = (playerId: string) => {
        const players = Shared.utils.StorageManager.get(aroundTablePlayersCacheKey());

        return players ? players[playerId] : null;
    };

    export const getEmptyPlayerSlot = (playersComponent: AroundTablePlayerComponent[]): AroundTablePlayerComponent => {
        return find(playersComponent, (player: AroundTablePlayerComponent) => !player.aroundTablePlayer?.id);
    };

    export const aroundTablePlayersCacheKey = (): string => {
        const gameName = FunctionUtils.getNamespace();
        return `PLAYERS_${gameName}`;
    };

    export const storePlayerToCache = (player: IAroundTablePlayers) => {
        if (player.type) {
            return;
        }

        let players = Shared.utils.StorageManager.get(aroundTablePlayersCacheKey());

        if (!players) {
            players = {};
        }

        players[player.id] = player;
        Shared.utils.StorageManager.set(aroundTablePlayersCacheKey(), players);
    };

    export const getBetItem = (betItems: BetItem[], betChoice: string): BetItem => {
        return find(betItems, (item: BetItem) => item.betChoice === betChoice);
    };

    export const isIdle = (playersComponent: AroundTablePlayerComponent) => {
        return playersComponent.aroundTablePlayer.idleCount > AroundTablePlayerComponent.maxIdleCount;
    };

    export const updatePlayerSlotDataStorage = (playerChip: gc.GameServiceMessage.PlayerChip, playerSlot: AroundTablePlayerComponent) => {
        playerSlot.setBalance(playerChip.red);
        playerSlot.aroundTablePlayer.idleCount = 0;
        AroundTablePlayerUtils.storePlayerToCache(playerSlot.aroundTablePlayer);
    };

    export const addAroundTablePlayerInfo = (newPlayerInfo: INewPlayerInfo) => {
        const { value } = newPlayerInfo ?? {};
        let clonePlayerInfo = null;
        if (value) {
            const { id, name, red, avatarId, type, idleCount = 0 } = value;
            clonePlayerInfo = {
                id,
                name,
                red,
                avatarId,
                type,
                idleCount,
            };
        }

        newPlayerInfo?.playerComp.setInfo(clonePlayerInfo).catch(() => {
            console.log("Error setInfo");
        });
    };
}
