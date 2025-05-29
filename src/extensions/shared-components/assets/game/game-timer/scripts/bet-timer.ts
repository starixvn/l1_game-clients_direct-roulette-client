import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";

import TwoDigitsTimer from "./two-digits-timer";

const { Rounds } = gc;
const { RoundTimeStore } = Rounds;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;
@ccclass
export default class BetTimer extends TwoDigitsTimer {
    @render(RoundTimeStore, (store) => store.countdownTimer)
    setTime(time: number) {
        super.setTime(time);
    }

    @render(RoundTimeStore, (store) => store.roundState)
    setState(state: string) {
        super.setState(state);
    }

    @render(RoundTimeStore, (store) => store.isInRoundTime)
    setVisibility(isInRoundTime: boolean) {
        this.node.active = isInRoundTime;
    }
}
