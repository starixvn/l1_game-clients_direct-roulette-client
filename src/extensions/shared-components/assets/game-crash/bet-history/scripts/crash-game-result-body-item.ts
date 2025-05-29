import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";

const { ccclass } = _decorator;
const { property } = _decorator;
const { FormatUtils } = gc;

@ccclass
export default class CrashGameResultBodyItem extends BaseResultBodyItem {
    @property(Label)
    lblResult: Label = null;

    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {
        this.lblResult.string = `${FormatUtils.numberWithCommas(+result, 2, false)}x`;
    }
}
