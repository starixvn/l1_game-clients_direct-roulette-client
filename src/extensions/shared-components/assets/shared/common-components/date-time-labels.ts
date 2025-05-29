import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DateTimeLabels")
export class DateTimeLabels extends Component {
    @property(Label)
    lblDate: Label = null;

    @property(Label)
    lblTime: Label = null;

    setTime(time: string) {
        const date = gc.DateTimeUtils.getStringDate(time);
        const hour = gc.DateTimeUtils.getStringHourByTime(time);
        this.lblDate && (this.lblDate.string = date);
        this.lblTime && (this.lblTime.string = hour);
    }
}
