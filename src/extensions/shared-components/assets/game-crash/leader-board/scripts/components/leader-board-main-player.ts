import gc from "@sg/game-client-base";
import { _decorator, Component } from "cc";

import { LeaderBoardCashOut } from "./leader-board-cash-out";

const { ccclass, property } = _decorator;
@ccclass
export class LeaderBoardMainPlayer extends Component {
    @property(LeaderBoardCashOut)
    firstRow: LeaderBoardCashOut = null;

    @property(LeaderBoardCashOut)
    secondRow: LeaderBoardCashOut = null;

    onLoad() {
        this.setSecondRowDisplay(false);
    }

    setData(data: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        const { name, cashOut, halfCashOut, amount } = data;

        this.setSecondRowDisplay(false);

        if (halfCashOut && cashOut) {
            this.firstRow.setData({
                name,
                amount: cashOut.amount,
                multiplier: cashOut.multiplier,
                win: cashOut.win,
            });

            this.setSecondRowDisplay(true);
            this.secondRow.setData({
                name,
                amount: halfCashOut.amount,
                multiplier: halfCashOut.multiplier,
                win: halfCashOut.win,
            });
        } else if (halfCashOut) {
            this.firstRow.setData({
                name,
                amount: halfCashOut.amount,
                multiplier: halfCashOut.multiplier,
                win: halfCashOut.win,
            });

            this.setSecondRowDisplay(true);
            this.secondRow.setData({
                name,
                amount: halfCashOut.amount,
            });
        } else if (cashOut) {
            this.firstRow.setData({
                name,
                amount: cashOut.amount,
                multiplier: cashOut.multiplier,
                win: cashOut.win,
            });
        } else {
            this.firstRow.setData({
                name,
                amount,
            });
        }
    }

    setSecondRowDisplay(status: boolean) {
        this.secondRow.node.active = status;
    }

    isShowSecondRow(): boolean {
        return this.secondRow.node.active;
    }
}
