import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { addChipsToChipBoxWhenJoinRoom, getChipQuantity } from "../../../game/chip-flying/scripts/components/actions";
import { ChipFlying } from "../../../game/chip-flying/scripts/components/chip-flying";

const { ccclass } = _decorator;
const { render } = Observer;

const { Rounds } = gc;

@ccclass("ChipFlyingInstant")
export default class ChipFlyingInstant extends ChipFlying {
    protected isShowChips = false;
    private isFirstJoinGame = true;

    override async flyChipsWhenJoinGame(chipsByMainPlayerRate: gc.Chips.TChipsByMainPlayerRate) {}

    @render(Rounds.RoundTimeStore, (store) => store.isDisplayingResultState)
    isShowMainPlayerChips(isShow: boolean) {
        this.isShowChips = isShow;
    }

    @render(Rounds.RoundStore, (store) => store.ownBets, { fireImmediately: false })
    renderMainPlayerChips(ownBets: gc.GameServiceMessage.OwnBets) {
        if (this.isShowChips && this.isFirstJoinGame && this.betItems) {
            for (const betItem of this.betItems.betItemComponents) {
                if (+ownBets[betItem.betChoice] > 0) {
                    const chipGroup = getChipQuantity(+ownBets[betItem.betChoice], this.slidingChip.chipValues);
                    if (chipGroup) {
                        const nodes = addChipsToChipBoxWhenJoinRoom(this.chipContainer, betItem.chipBox, chipGroup, this.slidingChip);
                        this.addChipsToBoxWithChoice(nodes, betItem.betChoice);
                    }
                }
            }
        }
        this.isFirstJoinGame = false;
    }

    handlePayMoneySound() {} // removed paymoney sound for Instant game
}
