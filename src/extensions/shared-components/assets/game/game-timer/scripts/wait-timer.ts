import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";

import { SingleTimer } from "./single-timer";

const { Rounds } = gc;
const { RoundTimeStore } = Rounds;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class WaitTimer extends SingleTimer {
    @render(RoundTimeStore, (store) => store.roundState)
    setVisibility(state: string) {
        this.node.active = state === Rounds.ROUND_STATE.SHOW_RESULT;
    }
}
