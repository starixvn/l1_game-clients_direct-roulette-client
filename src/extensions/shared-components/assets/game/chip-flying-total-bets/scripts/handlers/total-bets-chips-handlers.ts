import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

import { getChipQuantity } from "../../../chip-flying/scripts/components/actions/fly-chip-to-box";

const { injectable, inject } = inversify;

export interface IBetChoice {
    [betChoice: string]: number;
}

@injectable()
export class TotalBetsChipsHandler {
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;
    @inject(gc.Rounds.RoundStore) private readonly roundStore: gc.Rounds.RoundStore;
    @inject(gc.Settlements.SettlementStore) private readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(gc.Chips.ChipHandlers) protected readonly chipHandlers: gc.Chips.ChipHandlers;
    @inject(gc.GameConfigs.GameConfigStore) protected readonly gameConfigStore: gc.GameConfigs.GameConfigStore;
    @inject(gc.Rounds.RoundTimeStore) protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    private prevTotalBets: IBetChoice = null;
    private prevOffsetTotalBets: IBetChoice = null;

    constructor() {
        setTimeout(() => {
            mobx.reaction(
                () => this.settlementStore.currentFinish,
                (currentFinish) => {
                    if (currentFinish) {
                        this.prevTotalBets = {};
                        this.prevOffsetTotalBets = {};
                    }
                }
            );
        }, 0);
    }

    async handle(totalBets: IBetChoice) {
        if (!totalBets || this.isSameTotalBets(totalBets) || !this.gameConfigStore.initialized) {
            return;
        }

        if (!this.prevTotalBets) {
            this.restorePrevOffsetTotalBets();
            this.handleInitialBets(totalBets);
            return;
        }

        await this.handleSubsequentBets(totalBets);
        this.prevTotalBets = totalBets;
    }

    private restorePrevOffsetTotalBets() {
        const existingOffsetTotalBetsStorage =
            gc.Shared.utils.StorageManager.get("OffsetTotalBetsChips")?.[this.roundStore.clientRoundId] || {};

        if (Object.keys(existingOffsetTotalBetsStorage).length > 0) {
            this.prevOffsetTotalBets = existingOffsetTotalBetsStorage;
        }
        gc.Shared.utils.StorageManager.remove("OffsetTotalBetsChips");
    }

    private handleInitialBets(totalBets: IBetChoice) {
        this.prevTotalBets = totalBets;
        const clientRoundId = this.roundStore.clientRoundId;
        const chipsDataStorage = gc.Shared.utils.StorageManager.get("TotalBetsChips")?.[clientRoundId];

        if (!chipsDataStorage || Object.keys(chipsDataStorage).length === 0) {
            this.handleNewRoundBets(totalBets);
        } else {
            this.handleExistingRoundBets(totalBets, chipsDataStorage);
        }
    }

    private handleNewRoundBets(totalBets: IBetChoice) {
        gc.Shared.utils.StorageManager.remove("TotalBetsChips");
        const chips = this.parseChipsFromTotalBets(totalBets);
        this.chipHandlers.handleChips({ [this.mainPlayerStore.rate]: chips });
    }

    private handleExistingRoundBets(totalBets: IBetChoice, chipsDataStorage: Record<string, any>) {
        const adjustedTotalBets = this.calculateAdjustedTotalBets(totalBets, chipsDataStorage);
        const chips = this.parseChipsFromTotalBets(adjustedTotalBets);

        const updatedChipsStorage = this.updateChipsStorage(chipsDataStorage, chips);
        const clientRoundId = this.roundStore.clientRoundId;

        gc.Shared.utils.StorageManager.set("TotalBetsChips", { [clientRoundId]: { chips: updatedChipsStorage } });
        this.chipHandlers.handleChips({ [this.mainPlayerStore.rate]: updatedChipsStorage });
    }

    private calculateAdjustedTotalBets(totalBets: IBetChoice, chipsDataStorage: Record<string, any>): IBetChoice {
        const adjustedBets = { ...totalBets };
        Object.keys(totalBets).forEach((choice) => {
            const betQuantity = totalBets[choice] - (chipsDataStorage[choice] ? this.calculateTotalAmount(chipsDataStorage[choice]) : 0);
            adjustedBets[choice] = betQuantity > 0 ? betQuantity : 0;
        });
        return adjustedBets;
    }

    private updateChipsStorage(chipsDataStorage: Record<string, any>, chips: Record<string, any>): Record<string, any> {
        const updatedStorage = { ...chipsDataStorage };
        Object.keys(chips).forEach((choice) => {
            const betChoiceChips = chipsDataStorage[choice];
            updatedStorage[choice] = betChoiceChips ? this.combineChips(betChoiceChips, chips[choice] || {}) : chips[choice] || {};
        });
        return updatedStorage;
    }

    private combineChips(existing: Record<string, number>, newValue: Record<string, number>): Record<string, number> {
        return Object.keys(existing).reduce((acc, key) => {
            acc[key] = (existing[key] || 0) + (newValue[key] || 0);
            return acc;
        }, {});
    }

    private async handleSubsequentBets(totalBets: IBetChoice) {
        const offsetTotalBets = this.calculateOffsetTotalBets(totalBets);
        await Promise.all(Object.entries(offsetTotalBets).map(([choice, amount]) => this.queueChipUpdate(choice, amount)));
    }

    private queueChipUpdate(choice: string, amount: number) {
        const playerChip = {
            playerId: "123",
            betChoice: choice,
            amount: amount * this.mainPlayerStore.rate,
            red: 1000,
        };
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                this.chipStore.playerChip = playerChip;
                resolve();
            }, 0);
        });
    }

    private calculateTotalAmount(chips: Record<string, number>): number {
        return Object.entries(chips).reduce((sum, [denomination, quantity]) => {
            return sum + parseFloat(denomination) * quantity;
        }, 0);
    }

    private calculateOffsetTotalBets(totalBets: IBetChoice): IBetChoice {
        const offset: IBetChoice = {};
        const latestOffsetStorage: IBetChoice = {};
        const clientRoundId = this.roundStore.clientRoundId;

        Object.keys(totalBets).forEach((betChoice) => {
            const ownBet = this.roundStore.ownBets?.[betChoice] || 0;
            const prevOffsetTotalBetsChoice = this.prevOffsetTotalBets?.[betChoice] || 0;
            const offsetTotalBets = totalBets[betChoice] - ownBet;

            latestOffsetStorage[betChoice] = offsetTotalBets;
            offset[betChoice] = offsetTotalBets > prevOffsetTotalBetsChoice ? offsetTotalBets - prevOffsetTotalBetsChoice : 0;
        });

        this.prevOffsetTotalBets = latestOffsetStorage;

        gc.Shared.utils.StorageManager.set("OffsetTotalBetsChips", { [clientRoundId]: latestOffsetStorage });

        return offset;
    }

    private isSameTotalBets(totalBets: IBetChoice): boolean {
        return (
            this.prevTotalBets &&
            Object.keys(totalBets).length === Object.keys(this.prevTotalBets).length &&
            Object.keys(totalBets).every((key) => this.prevTotalBets.hasOwnProperty(key) && totalBets[key] === this.prevTotalBets[key])
        );
    }

    private parseChipsFromTotalBets(totalBets: gc.GameServiceMessage.TotalBets) {
        if (!totalBets) {
            return;
        }
        let chips = {};
        Object.keys(totalBets).forEach((choice) => {
            const chipValues = getChipQuantity(totalBets[choice], this.chipStore.chipValuesByStakeLevel);
            const tempLowerChip = chipValues[0] ? { 0.5: chipValues[0] } : {};
            const newChipsWithLowerChips = Object.assign(
                tempLowerChip,
                Object.fromEntries(Object.entries(chipValues).filter(([key]) => key !== "0"))
            );

            chips[choice] = newChipsWithLowerChips;
        });

        return chips;
    }
}
