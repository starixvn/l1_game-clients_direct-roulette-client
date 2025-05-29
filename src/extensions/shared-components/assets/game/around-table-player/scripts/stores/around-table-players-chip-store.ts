import gc from "@sg/game-client-base";
import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";

import { getChipQuantity } from "../../../chip-flying/scripts/components/actions";
import { AroundTablePlayerComponent } from "../components/around-table-player-component";

const { injectable, inject } = inversify;

export interface IAroundTablePlayers extends gc.GameServiceMessage.AroundTablePlayer {
    idleCount?: number;
}

export interface IHiddenPlayers {
    [playerId: string]: IAroundTablePlayers;
}

export interface INewPlayerInfo {
    playerComp: AroundTablePlayerComponent;
    value: IAroundTablePlayers;
}

export interface IAroundTablePlayerChip {
    playerChip: gc.GameServiceMessage.PlayerChip;
    chipValues: {
        [value: number]: number;
    };
    clientRoundId: number;
}

export interface IAroundTablePlayerPlaceChip {
    betChoice: string;
    chipValues: {
        [value: number]: number;
    };
    chipBox: Node;
    startNode: Node;
    isHiddenPlayer?: boolean;
}

@injectable()
export class AroundTablePlayersChipStore {
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;
    @inject(gc.Rounds.RoundStore) private readonly roundStore: gc.Rounds.RoundStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get aroundTablePlayerChip(): IAroundTablePlayerChip {
        const playerChip = this.chipStore.playerChip;

        if (playerChip) {
            const chipValues = getChipQuantity(playerChip?.amount, this.chipStore.chipValuesByStakeLevel);

            return {
                chipValues,
                playerChip,
                clientRoundId: this.roundStore.clientRoundId,
            };
        }

        return null;
    }
}
