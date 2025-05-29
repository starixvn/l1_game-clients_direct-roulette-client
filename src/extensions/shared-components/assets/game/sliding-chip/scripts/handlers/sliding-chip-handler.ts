import gc from "@sg/game-client-base";
import inversify from "inversify";
import { SlidingChipStore } from "../stores/sliding-chip-store";

const { injectable, inject } = inversify;
export namespace SlidingChipHandler {
    @injectable()
    export class ClickArrow {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handleNext({ chipMovingStep }) {
            this.slidingChipStore.handleClickNext(chipMovingStep);
        }

        async handlePrev({ chipMovingStep }) {
            this.slidingChipStore.handleClickPrev(chipMovingStep);
        }
    }

    @injectable()
    export class CreateChips implements gc.Shared.IHandler<{ chipsLength: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ chipsLength }) {
            this.slidingChipStore.chipsLength = chipsLength;
        }
    }

    @injectable()
    export class UpdateChips implements gc.Shared.IHandler<void> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
        @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;
        @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;

        async handle() {
            const chipValues = this.chipStore.chipValuesByStakeLevel;
            const currentBet =
                chipValues.findIndex((value) => parseInt(value.toString()) === parseInt(this.slidingChipStore.currentChip)) !== -1
                    ? this.slidingChipStore.currentChip
                    : chipValues[0] && chipValues[0].toString();
            if (currentBet === undefined) {
                return;
            }
            this.slidingChipStore.isResetScrollViewOffset = currentBet !== this.slidingChipStore.currentChip;
            this.betStore.amount = +currentBet;
        }
    }

    @injectable()
    export class UpdateSelectChip implements gc.Shared.IHandler<{ displayMin: number; displaySize: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ displayMin, displaySize }) {
            this.slidingChipStore.handleSelectChip(displayMin, displaySize);
        }
    }

    @injectable()
    export class SetSelectChip implements gc.Shared.IHandler<{ selectedChip: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ selectedChip }) {
            this.slidingChipStore.selectChip = selectedChip;
        }
    }

    @injectable()
    export class UpdateCurrentBet implements gc.Shared.IHandler<{ bet: string }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
        @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;

        async handle({ bet }) {
            this.slidingChipStore.currentChip = bet;
            this.betStore.amount = +bet;
        }
    }

    @injectable()
    export class ResetChips implements gc.Shared.IHandler<void> {
        @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;

        async handle() {
            this.chipStore.resetChips();
        }
    }
}
