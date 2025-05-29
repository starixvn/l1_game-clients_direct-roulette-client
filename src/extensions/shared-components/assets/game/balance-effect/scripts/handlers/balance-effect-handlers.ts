import inversify from "inversify";
import { BalanceEffectStore, TBalanceEffect, TWinningEffect } from "../stores/balance-effect-store";

const { injectable, inject } = inversify;

export namespace BalanceEffectHandlers {
    @injectable()
    export class MainPlayerDecreaseBalance {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balance: number) {
            this.balanceEffectStore.updateMainPlayerDecreaseBalance(balance);
        }
    }

    @injectable()
    export class MainPlayerIncreaseBalance {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balance: number) {
            this.balanceEffectStore.updateMainPlayerIncreaseBalance(balance);
        }
    }

    @injectable()
    export class MainPlayerWinEffect {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(status: boolean) {
            this.balanceEffectStore.updateMainPlayerWinEffect(status);
        }
    }
    @injectable()
    export class AroundTablePlayersWinEffect {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(winningEffects: TWinningEffect[]) {
            this.balanceEffectStore.updateAroundTablePlayersWinEffect(winningEffects);
        }
    }

    @injectable()
    export class AroundTablePlayersIncreaseBalance {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balanceEffects: TBalanceEffect[]) {
            this.balanceEffectStore.updateAroundTablePlayersIncreaseBalance(balanceEffects);
        }
    }
}
