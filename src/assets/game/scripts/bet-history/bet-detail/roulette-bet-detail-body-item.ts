import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node } from 'cc';
import { BaseBetDetailLogItem, BetDetailLogItemType } from 'db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item';
import { RouletteBetType } from "../../roulette-choices";

const { Translator, FormatUtils } = gc;
const { ccclass, property } = _decorator;

@ccclass
export class RouletteBetDetailBodyItem extends BaseBetDetailLogItem {
    @property(Label)
    lblBetType: Label = null;

    @property(Label)
    lblChoice: Label = null;

    @property(Label)
    lblAmount: Label = null;

    @property(Label)
    lblDate: Label = null;

    @property(Label)
    lblHour: Label = null;

    setData(data: BetDetailLogItemType) {
        super.setData(data);

        const { betDetailsLog } = data;
        
        // Extract date and time information
        const { time } = betDetailsLog as any;
        if (time) {
            const date = gc.DateTimeUtils.getStringDate(time);
            const hour = gc.DateTimeUtils.getStringHourByTime(time);
            this.lblDate && (this.lblDate.string = date);
            this.lblHour && (this.lblHour.string = hour);
        }
        
        // Extract the single bet from this log (should contain only one bet type)
        const { betType, choice, amount } = this.extractBetData(betDetailsLog);
        
        // Set the display values
        this.formatBetTypeDisplay(betType);
        this.formatChoiceDisplay(choice, betType);
        
        // Update amount display
        if (amount > 0) {
            this.lblAmount.string = FormatUtils.numberWithCommas(amount, 2);
        }
        
        // Check if this bet won and highlight it
        const isWinning = this.checkIfBetWon(betType, choice, data);
        this.setHighlightDetail(isWinning);
    }

    // Static method to split a multi-bet log into individual bet logs
    static splitBetDetailLog(originalData: BetDetailLogItemType): Array<BetDetailLogItemType> {
        const { betDetailsLog } = originalData;
        const individualLogs: Array<BetDetailLogItemType> = [];
        
        for (const betType of Object.values(RouletteBetType)) {
            if (betDetailsLog[betType]) {
                for (const choice in betDetailsLog[betType]) {
                    const amount = betDetailsLog[betType][choice];
                    const newBetLog = {
                        time: betDetailsLog.time,
                        currency: betDetailsLog.currency,
                        rate: betDetailsLog.rate,
                        operatorId: betDetailsLog.operatorId,
                        [betType]: { [choice]: amount }
                    };
                    
                    individualLogs.push({
                        ...originalData,
                        betDetailsLog: newBetLog
                    });
                }
            }
        }
        
        return individualLogs;
    }

    private extractBetData(betDetailsLog: any): { betType: string, choice: string, amount: number } {
        // Find first bet in the log
        for (const betType of Object.values(RouletteBetType)) {
            if (betDetailsLog[betType]) {
                const betData = betDetailsLog[betType];
                for (const choice in betData) {
                    return { betType, choice, amount: betData[choice] };
                }
            }
        }
        return { betType: "", choice: "", amount: 0 };
    }

    private formatBetTypeDisplay(type: string) {
        const betTypeKeys: { [key: string]: string } = {
            [RouletteBetType.StraightUp]: "type_straight_up",
            [RouletteBetType.Split]: "type_split",
            [RouletteBetType.Street]: "type_street", 
            [RouletteBetType.Triangle]: "type_triangle",
            [RouletteBetType.Corner]: "type_corner",
            [RouletteBetType.FourNumbers]: "type_4number",
            [RouletteBetType.Line]: "type_line",
            [RouletteBetType.Column]: "type_column",
            [RouletteBetType.Dozen]: "type_dozen",
            [RouletteBetType.RedBlack]: "type_red_black",
            [RouletteBetType.OddEven]: "type_odd_even",
            [RouletteBetType.BigSmall]: "type_big_small"
        };

        const translationKey = betTypeKeys[type];
        this.lblBetType.string = translationKey ? Translator.gameTranslate(translationKey) : type;
    }

    private formatChoiceDisplay(choice: string, type: string) {
        if (!choice) {
            this.lblChoice.string = "";
            return;
        }

        const choiceFormatters = {
            [RouletteBetType.BigSmall]: () => choice === "small" ? "1-18" : choice === "big" ? "19-36" : choice,
            [RouletteBetType.OddEven]: () => Translator.gameTranslate(`choice_${choice}`),
            [RouletteBetType.RedBlack]: () => Translator.gameTranslate(`choice_${choice}`),
            [RouletteBetType.Dozen]: () => {
                const ranges = { "1": "1-12", "2": "13-24", "3": "25-36" };
                return ranges[choice] || choice;
            },
            [RouletteBetType.Column]: () => Translator.gameTranslate(`column_number`, { num: choice }),
            [RouletteBetType.Line]: () => {
                if (choice.includes("-")) {
                    const numbers = choice.split("-");
                    return `${numbers.slice(0, 3).join(", ")}\n${numbers.slice(3, 6).join(", ")}`;
                }
                return choice;
            }
        };

        const formatter = choiceFormatters[type];
        if (formatter) {
            this.lblChoice.string = formatter();
        } else if (choice.includes("-")) {
            // Multi-number bets (split, street, triangle, corner, fourNumbers)
            this.lblChoice.string = choice.split("-").join(", ");
        } else {
            this.lblChoice.string = choice;
        }
    }

    private checkIfBetWon(betType: string, choice: string, data: BetDetailLogItemType): boolean {
        const { settlementResult } = data;
        
        // Check if choice is in the winning choices array for this bet type
        if (settlementResult && settlementResult[betType]) {
            const winningChoices = settlementResult[betType];
            return Array.isArray(winningChoices) && winningChoices.includes(choice);
        }
        
        return false;
    }

    private setHighlightDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblChoice.color = color;
        this.lblAmount.color = color;
    }
}
