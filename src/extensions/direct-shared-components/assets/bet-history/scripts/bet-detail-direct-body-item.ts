import { _decorator, Label } from "cc";
import BetDetailLogItem, {
    BetDetailLogItemType,
    GameRoundBetDetailsLog,
} from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item";
import gc from "@sg/game-client-base";

const { ccclass, property } = _decorator;
const { DateTimeUtils } = gc;

@ccclass
export default class BetDetailDirectBodyItem extends BetDetailLogItem {
    @property(Label)
    lblDate: Label = null;

    @property(Label)
    lblHour: Label = null;

    setData(data: BetDetailLogItemType) {
        super.setData(data);

        const { betDetailsLog } = data;
        const { time } = betDetailsLog as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>;

        if (time) {
            const date = DateTimeUtils.getStringDate(time);
            const hour = DateTimeUtils.getStringHourByTime(time);
            this.lblDate && (this.lblDate.string = date);
            this.lblHour && (this.lblHour.string = hour);
        }
    }
}
