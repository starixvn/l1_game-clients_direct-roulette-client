import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node } from "cc";

const { ccclass, property } = _decorator;
const { DateTimeUtils, FormatUtils, Translator } = gc;

export interface GameRoundBetDetailsLog {
    amount: number;
    time: string;
    choice: string;
    rate: number;
    rebet: boolean;
}

export type BetDetailLogItemType = {
    betDetailsLog: gc.BetHistory.DynamicObject<object>;
    index: number;
    odds: gc.BetHistory.DynamicObject<number>;
    settlementResult: gc.BetHistory.DynamicObject<boolean>;
    result: gc.BetHistory.DynamicObject<object>;
    freeBet: boolean;
    fractionalOddsFormat: boolean;
};

export class BaseBetDetailLogItem extends Component {
    @property(Label)
    lblTime: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    refundChoices: string[] = [];
    refundRatio = 0.5;

    setData(data: BetDetailLogItemType) {
        const { index, betDetailsLog } = data;
        const { time } = betDetailsLog as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>;

        this.nodeBackground.active = index % 2 > 0;
        this.lblTime && (this.lblTime.string = time ? DateTimeUtils.formatDateTime(time) : "");
    }
}

@ccclass
export default class BetDetailLogItem extends BaseBetDetailLogItem {
    @property(Label)
    lblOdds: Label = null;

    @property(Label)
    lblAmount: Label = null;

    @property(Label)
    lblChoice: Label = null;

    setData(data: BetDetailLogItemType) {
        super.setData(data);

        const { betDetailsLog } = data;
        const { amount, choice } = betDetailsLog as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>;

        this.lblChoice.string = Translator.gameTranslate(`glossary_${choice}`);
        this.lblAmount.string = FormatUtils.numberWithCommas(amount, 2);
        this.parseOddByData(data);
        this.calculateWinValue(data);
    }

    protected calculateWinValue(data: BetDetailLogItemType) {
        const { betDetailsLog, settlementResult, freeBet, odds } = data;
        const { amount, choice } = betDetailsLog as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>;

        if (settlementResult[choice]) {
            const rawOdd = odds[choice];
            const effectiveOdds = freeBet ? rawOdd - 1 : rawOdd;
            const winningAmount = amount * effectiveOdds;
            this.lblWin.string = FormatUtils.numberWithCommas(winningAmount, 2);
            this.setHighlightTicketDetail(winningAmount > amount);
        } else {
            if (this.needRefund(settlementResult)) {
                const value = amount * this.refundRatio;
                this.lblWin.string = FormatUtils.numberWithCommas(value, 2);
            } else {
                this.lblWin.string = "0";
            }
        }
    }

    needRefund(settlementResult: gc.BetHistory.DynamicObject<boolean>) {
        return this.refundChoices.findIndex((choice) => settlementResult[choice]) > -1;
    }

    parseOddByData(data) {
        const { betDetailsLog } = data;
        const { choice } = betDetailsLog;
        const odds = data.odds[choice];
        this.lblOdds.string = data.fractionalOddsFormat ? gc.FormatUtils.numberWithCommas(+odds - 1, 2) : odds.toString();
    }

    setHighlightTicketDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblChoice.color = color;
        this.lblOdds.color = color;
        this.lblAmount.color = color;
    }
}
