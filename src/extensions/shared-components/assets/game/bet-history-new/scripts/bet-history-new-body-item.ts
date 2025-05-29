import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import BetHistoryBodyItem, { BetHistoryBodyItemType } from "../../bet-history/scripts/components/bet-history-body-item";
const { ccclass } = _decorator;
const { DateTimeUtils } = gc;

@ccclass
export class BetHistoryNewBodyItem extends BetHistoryBodyItem {
    setData(data: BetHistoryBodyItemType) {
        super.setData(data);
        const { time } = data.betHistoryLog;
        this.lblTime && (this.lblTime.string = `${DateTimeUtils.getStringDate1(time)} ${DateTimeUtils.getString12HourByTime(time)}`);
    }

    protected getFormatOdd(value: string, isFractional: boolean) {
        return isFractional ? gc.FormatUtils.numberWithCommas(+value - 1, 2) : value;
    }
}
