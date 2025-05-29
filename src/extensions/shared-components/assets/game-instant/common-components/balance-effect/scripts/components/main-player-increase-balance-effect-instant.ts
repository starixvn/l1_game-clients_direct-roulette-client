import { _decorator } from "cc";
import { MainPlayerIncreaseBalanceEffect } from "../../../../../game/balance-effect/scripts/components/main-player-increase-balance-effect";

const { ccclass } = _decorator;

@ccclass()
export class MainPlayerIncreaseBalanceEffectInstant extends MainPlayerIncreaseBalanceEffect {
    protected fontSize = 40;
}
