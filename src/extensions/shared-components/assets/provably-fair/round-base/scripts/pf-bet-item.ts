import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import BetItem from "../../../game/bets/scripts/components/bet-item";

const { handle } = Observer;
const { ccclass, property } = _decorator;

@ccclass
export class PFBetItem extends BetItem {
    @handle(gc.RoundBasePF.PFBetHandler, (handler, payload: string) => handler.handle(payload))
    onPFBet() {
        return this.node.name;
    }

    callBet(): void {
        this.onPFBet();
    }
}
