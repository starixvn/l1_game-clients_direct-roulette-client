import { _decorator, Label } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import gc from "@sg/game-client-base";

const { ccclass, property } = _decorator;

@ccclass
export class RouletteResultBodyItem extends BaseResultBodyItem {

    @property(Label)
    result: Label = null;

    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {
        this.result.string = String(result);
    }
}
