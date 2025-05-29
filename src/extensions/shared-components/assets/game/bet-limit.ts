import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render } = Observer;
const { Rounds, FormatUtils } = gc;

@ccclass
export class BetLimit extends ObserverComponent {
    @property(Label)
    label: Label = null;

    private minBet = 0;
    private maxBet = 0;

    @render(Rounds.RoundStore, (store) => store.minBet)
    renderMinBet(minBet: number) {
        this.minBet = minBet;
        this.renderRangeBetLimit();
    }

    @render(Rounds.RoundStore, (store) => store.maxBet)
    renderMaxBet(maxBet: number) {
        this.maxBet = maxBet;
        this.renderRangeBetLimit();
    }

    renderRangeBetLimit() {
        this.label.string = `${FormatUtils.numberWithCommas(this.minBet, 2)} - ${FormatUtils.numberWithCommas(this.maxBet, 2)}`;
    }
}
