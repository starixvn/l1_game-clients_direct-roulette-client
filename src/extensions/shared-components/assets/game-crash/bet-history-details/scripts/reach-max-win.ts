import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";

const { ccclass, property } = _decorator;
const { FormatUtils } = gc;

@ccclass
export class ReachMaxWin extends Component {
    @property(Label)
    lblReachMaxWin: Label = null;

    setData(betLogDetails) {
        const reachMaxWinLogs = betLogDetails.find((log) => log.reachMaxWin === true);
        this.node.active = !!reachMaxWinLogs;

        let totalWin = 0;
        betLogDetails.forEach((log) => {
            totalWin += log.winAmount;
        });
        this.lblReachMaxWin.string = FormatUtils.numberWithCommas(totalWin, 2);
    }
}
