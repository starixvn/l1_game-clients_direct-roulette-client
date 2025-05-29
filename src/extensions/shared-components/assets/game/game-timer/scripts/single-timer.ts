import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

const { Rounds } = gc;
const { RoundTimeStore } = Rounds;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export class SingleTimer extends ObserverComponent {
    @property({ type: Label })
    lblSingle: Label = null;

    @render(RoundTimeStore, (store) => store.countdownTimer)
    setTime(time: number) {
        this.lblSingle.string = time.toString().padStart(2, "0");
    }
}
