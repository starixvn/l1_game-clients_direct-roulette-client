import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
import { MainPlayerProfileStore } from "../../../main-player-profile/scripts/stores/main-player-profile-store";
const { injectable, inject } = inversify;

export type TBalanceEffect = {
    effectNode: Node;
    balance: number;
};

export type TUpdateBalance = {
    balanceEffect: TBalanceEffect;
};

export type TWinningEffect = {
    effectNode: Node;
    status: boolean;
};

export type TWinningEffects = {
    winningEffects: TWinningEffect[];
};

export type TUpdateBalances = {
    balanceEffects: TBalanceEffect[];
};

@injectable()
export class BalanceEffectStore {
    decreaseBalanceMainPlayer: TUpdateBalance = null;
    increaseBalanceMainPlayer: TUpdateBalance = null;
    winEffectMainPlayer: TWinningEffect = null;
    winEffectAroundTablePlayers: TWinningEffects = null;
    increaseBalanceAroundTablePlayers: TUpdateBalances = null;

    @inject(MainPlayerProfileStore) private readonly mainPlayerProfileStore: MainPlayerProfileStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    updateMainPlayerDecreaseBalance(balance: number) {
        const balanceEffect = { balance, effectNode: this.mainPlayerProfileStore.containerEffectNode };
        this.decreaseBalanceMainPlayer = { balanceEffect };
    }

    updateMainPlayerIncreaseBalance(balance: number) {
        const balanceEffect = { balance, effectNode: this.mainPlayerProfileStore.containerEffectNode };
        this.increaseBalanceMainPlayer = { balanceEffect };
    }

    updateMainPlayerWinEffect(status: boolean) {
        this.winEffectMainPlayer = { status, effectNode: this.mainPlayerProfileStore.containerEffectNode };
    }

    updateAroundTablePlayersWinEffect(winningEffects: TWinningEffect[]) {
        this.winEffectAroundTablePlayers = { winningEffects };
    }

    updateAroundTablePlayersIncreaseBalance(balanceEffects: TBalanceEffect[]) {
        this.increaseBalanceAroundTablePlayers = { balanceEffects };
    }
}
