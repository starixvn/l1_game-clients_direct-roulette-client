import { _decorator } from "cc";
import { MainPlayerDecreaseBalanceEffect } from "../../../../../game/balance-effect/scripts/components/main-player-decrease-balance-effect";

const { ccclass } = _decorator;

@ccclass()
export class MainPlayerDecreaseBalanceEffectInstant extends MainPlayerDecreaseBalanceEffect {
    protected fontSize = 40;
}
