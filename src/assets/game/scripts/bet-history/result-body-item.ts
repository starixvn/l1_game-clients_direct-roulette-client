import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import gc from "@sg/game-client-base";
import { BetChoice } from "../seven-up-down-choices";

const { ccclass, property } = _decorator;

@ccclass
export class ResultBodyItem extends BaseResultBodyItem {
    @property([Sprite])
    dices: Sprite[] = [];

    @property(Label)
    total: Label = null;

    @property([SpriteFrame])
    dicesSpriteFrames: SpriteFrame[] = [];

    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {
        this.showDiceResult(result, this.dicesSpriteFrames, settlementResult);
    }

    showDiceResult(result: any, dicesSpriteFrames: SpriteFrame[], settlementResult: any) {
        this.dices[0].spriteFrame = dicesSpriteFrames[result.dice1 - 1];
        this.dices[1].spriteFrame = dicesSpriteFrames[result.dice2 - 1];
        const winChoice = ["up", "down", "seven"].find((choice) => settlementResult[choice]);

        const total = result.dice1 + result.dice2;
        const lblBetChoice = gc.Translator.gameTranslate(`glossary_${winChoice === "seven" ? BetChoice.SEVEN : winChoice}`);

        this.total.string = winChoice === "seven" ? "7" : `${total} - ${lblBetChoice}`;
    }
}
