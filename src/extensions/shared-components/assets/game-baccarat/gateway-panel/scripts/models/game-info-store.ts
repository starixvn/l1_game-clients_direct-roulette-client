import { EmitterEvents, Store, StoreBase } from "./definitions";
import { Durations } from "./durations-interface";

export interface RoundHistory {
    result: any;
    settlementResult: any;
    roundId: number;
}

export class GameInfoStore extends StoreBase {
    readonly DEFAULT_RTP = 98;
    storeName = Store.GameInfo;
    totalOnlineUsers = 0;
    rtp = this.DEFAULT_RTP;
    remainingTime = 0;
    newShoePhase = false;
    betLimit: { minBet: number; maxBet: number } = null;
    timer: any;
    durations: Durations;
    timeState = "";

    reset() {
        this.totalOnlineUsers = 0;
        this.rtp = this.DEFAULT_RTP;
        this.remainingTime = 0;
        this.newShoePhase = false;
        this.betLimit = null;
        this.clearTimer();
        this.updateUI();
    }

    changeOnlineUsers(totalOnlineUsers: number) {
        this.totalOnlineUsers = totalOnlineUsers;
        this.emit(EmitterEvents.TotalOnlineChange, this.totalOnlineUsers);
    }

    setNewShoe(active: boolean) {
        this.newShoePhase = active;
        this.emit(EmitterEvents.ActiveNewShoe, this.newShoePhase);
    }

    increaseOnlineUser() {
        this.changeOnlineUsers(this.totalOnlineUsers + 1);
    }

    decreaseOnlineUser() {
        const value = Math.max(this.totalOnlineUsers - 1, 0);
        this.changeOnlineUsers(value);
    }

    changeRtp(rtp: number) {
        if (!rtp) {
            return;
        }
        this.rtp = rtp;
        this.emit(EmitterEvents.RtpChange, this.rtp);
    }

    receiveTimeRemaining(time: number) {
        this.changeTime(time);
        this.activeTimer();
    }

    changeTime(time: number) {
        this.remainingTime = time;
        this.emit(EmitterEvents.TimeChange, this.remainingTime);

        const startRoundTimePoint = this.durations.placingBet + this.durations.startRound;
        if (time === startRoundTimePoint) {
            this.changeTimeState(EmitterEvents.StartRound);
        }

        if (time <= startRoundTimePoint) {
            this.setNewShoe(false);
        }

        if (time <= this.durations.placingBet && time > this.durations.lockingBet) {
            this.changeTimeState(EmitterEvents.PlacingBet);
        }

        if (time <= this.durations.lockingBet) {
            this.changeTimeState(EmitterEvents.LockingBet);
        }

        if (time > startRoundTimePoint || time === 0) {
            this.changeTimeState(EmitterEvents.Settling);
        }
    }

    changeTimeState(state: string) {
        if (this.timeState !== state) {
            this.timeState = state;
            this.emit(state);
        }
    }

    activeTimer() {
        this.clearTimer();
        this.timer = setInterval(() => {
            const value = this.remainingTime - 1;
            if (value >= 0) {
                this.changeTime(value);
            }

            if (value <= 0) {
                this.clearTimer();
            }
        }, 1000);
    }

    clearTimer() {
        this.timer && clearInterval(this.timer);
    }

    changeBetLimit(betLimit: { minBet: number; maxBet: number }) {
        this.betLimit = betLimit;
        this.emit(EmitterEvents.BetLimitChange, this.betLimit);
    }

    updateUI() {
        this.emit(EmitterEvents.RtpChange, this.rtp);
        this.emit(EmitterEvents.TotalOnlineChange, this.totalOnlineUsers);
        this.emit(EmitterEvents.TimeChange, this.remainingTime);
        this.emit(EmitterEvents.BetLimitChange, this.betLimit);
        this.emit(EmitterEvents.ActiveNewShoe, this.newShoePhase);
        this.emit(EmitterEvents.TimeStateChange, this.timeState);
    }
}
