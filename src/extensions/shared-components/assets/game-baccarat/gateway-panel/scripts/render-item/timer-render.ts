import { _decorator } from "cc";
import RawTwoDigitsTimer from "../../../../game/game-timer/scripts/raw-two-digits-timer";
import { EmitterEvents, Store } from "../models/definitions";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class TimerRender extends RenderItem {
    @property(RawTwoDigitsTimer)
    timer: RawTwoDigitsTimer = null;

    onLoad() {
        this.node.active = false;

        const data = this._gameData;
        const store = data.getStore(Store.GameInfo);
        store?.addListener(EmitterEvents.TimeChange, this.onTimeChange, this);
        store?.addListener(EmitterEvents.PlacingBet, this.onPlacingBet, this);
        store?.addListener(EmitterEvents.LockingBet, this.onLockingBet, this);
        store?.addListener(EmitterEvents.TimeStateChange, this.onTimeStateChange, this);

        store?.wakeUp();
    }

    clearRenderListeners() {
        const store = this._gameData?.getStore(Store.GameInfo);
        store.removeAll(this);
    }

    onTimeStateChange = (state: string) => {
        switch (state) {
            case EmitterEvents.PlacingBet:
                this.onPlacingBet();
                break;
            case EmitterEvents.LockingBet:
                this.onLockingBet();
                break;
            default:
                break;
        }
    };

    onTimeChange = (time) => {
        this.timer.setTime(time);
    };

    onLockingBet = () => {
        this.node.active = false;
    };
    onPlacingBet = () => {
        this.node.active = true;
    };
}
