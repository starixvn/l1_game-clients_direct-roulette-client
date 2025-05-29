import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node } from 'cc';
import BetDetailLogItem, { GameRoundBetDetailsLog } from 'db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item';
import { BetDetailLogItemType } from 'db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item';
import { BetChoice } from '../../seven-up-down-choices';
import BetDetailDirectBodyItem from 'db://direct-shared-components/bet-history/scripts/bet-detail-direct-body-item';

const { Translator, FormatUtils } = gc;
const { ccclass, property } = _decorator;

export interface Multiplier {
    choice: string;
    value: number;
}

@ccclass
export class BetDetailBodyItem extends BetDetailDirectBodyItem {
    @property(Label)
    lblMultiplier: Label = null;

    setData(data: BetDetailLogItemType) {
        super.setData(data);

        const { betDetailsLog, result} = data;
        const { choice } = betDetailsLog as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>;
       
        if (choice.includes("seven")) {
            this.lblChoice.string = Translator.gameTranslate(`glossary_${BetChoice.SEVEN}`);
        } else {
            this.lblChoice.string = Translator.gameTranslate(`glossary_${choice}`);
        }

        this.parseOddByData(data);
        this.calculateWinValue(data);
    }

    protected calculateWinValue(data: BetDetailLogItemType) {
        const { betDetailsLog, settlementResult, freeBet, odds, result } = data;
        const { amount, choice } = betDetailsLog as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>;
        const { multiplier } = result as gc.BetHistory.DynamicObject<Multiplier>;

        if (settlementResult[choice]) {
            const rawOdd = odds[choice];
            const effectiveOdds = rawOdd - 1;
            let winningAmount = amount * effectiveOdds;

            if (multiplier && choice.includes(multiplier.choice)) {
                winningAmount *= multiplier.value;
                this.lblMultiplier.string = `${multiplier.value}x`;
            } else {
                this.lblMultiplier.string = "-";
            }
            
            winningAmount += amount;
            this.lblWin.string = FormatUtils.numberWithCommas(winningAmount, 2);
            this.setHighlightMultiplierDetail(winningAmount > amount);
        } else {
            if (this.needRefund(settlementResult)) {
                const value = amount * this.refundRatio;
                this.lblWin.string = FormatUtils.numberWithCommas(value, 2);
            } else {
                this.lblWin.string = "0";
            }
        }
    }

    setHighlightMultiplierDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblMultiplier.color = color;
        this.lblChoice.color = color;
        this.lblOdds.color = color;
        this.lblAmount.color = color;
    }
}


