import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class SlidingChipStore {
    @inject(gc.PlayerSelections.PlayerSelectionStore) private readonly playerSelectionStore: gc.PlayerSelections.PlayerSelectionStore;
    constructor() {
        mobx.makeAutoObservable(this);

        mobx.when(
            () => !!this.playerSelectionStore?.chip,
            () => {
                this.selectChip = this.playerSelectionStore.chip;
            }
        );
    }

    chipsLength = 0;
    isResetScrollViewOffset = false;
    private _currentChip = "0";
    private _selectChip = 0;

    set selectChip(index: number) {
        this._selectChip = index;
    }

    get selectChip() {
        return this._selectChip;
    }

    onLoad(minChipSelect: number) {
        this._selectChip = minChipSelect;
    }

    handleClickNext(step: number) {
        this._selectChip += step;
    }

    handleClickPrev(step: number) {
        this._selectChip -= step;
    }

    set currentChip(value: string) {
        this._currentChip = value;
    }

    get currentChip() {
        return this._currentChip;
    }

    handleSelectChip(displayMin: number, displaySize: number) {
        if (this.selectChip < displayMin) {
            const selectedIndex = displayMin;
            this.selectChip = Math.min(selectedIndex, this.chipsLength - displaySize);
        } else if (this.selectChip > displayMin + displaySize - 1) {
            this.selectChip = displayMin + displaySize - 1;
        }
    }
}
