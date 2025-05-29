import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
const { GameCrash } = gc;
import BetTimer from "../../../game/game-timer/scripts/bet-timer";
const { ccclass } = _decorator;
const { render } = Observer;
@ccclass
export default class CrashGameBetTimer extends BetTimer {
    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    hideTimer(multiplier: number) {
        multiplier && this.node.active && (this.node.active = false);
    }
}
