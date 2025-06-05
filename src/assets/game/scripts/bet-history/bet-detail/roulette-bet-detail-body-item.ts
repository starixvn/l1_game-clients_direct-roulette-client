import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node } from 'cc';
import BetDetailLogItem, { GameRoundBetDetailsLog } from 'db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item';
import { BetDetailLogItemType } from 'db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item';
import { BetChoice } from '../../seven-up-down-choices';
import BetDetailDirectBodyItem from 'db://direct-shared-components/bet-history/scripts/bet-detail-direct-body-item';
import { RouletteBetType } from "../../roulette-choices";
import { BaseBetDetailLogItem } from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item";

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

    setData(data: BetDetailLogItemType, betIndex: number = 0) {
        super.setData(data);

        debugger;

        const { betDetailsLog } = data;
        
        // Extract all bet data from the structure
        const allBets = this.extractAllBetData(betDetailsLog);
        
        // Use the specified bet index, or default to first bet
        const bet = allBets[betIndex] || { betType: "", choice: "", amount: 0 };
        const { betType, choice, amount } = bet;
        
        // Set the display values
        this.formatBetTypeDisplay(betType);
        this.formatChoiceDisplay(choice, betType);
        
        // Update amount display
        if (amount > 0) {
            this.lblAmount.string = FormatUtils.numberWithCommas(amount, 2);
        }
    }

    // Helper method to get total number of bets in a log entry
    getBetCount(data: BetDetailLogItemType): number {
        const { betDetailsLog } = data;
        return this.extractAllBetData(betDetailsLog).length;
    }

    private extractAllBetData(betDetailsLog: any): Array<{ betType: string, choice: string, amount: number }> {
        const betTypes = Object.values(RouletteBetType);
        const bets: Array<{ betType: string, choice: string, amount: number }> = [];
        
        for (const type of betTypes) {
            if (betDetailsLog[type]) {
                const betData = betDetailsLog[type];
                
                // Get ALL choices for this bet type, not just the first one
                for (const choice in betData) {
                    const amount = betData[choice];
                    bets.push({ betType: type, choice, amount });
                }
            }
        }
        
        return bets;
    }

    private extractBetData(betDetailsLog: any): { betType: string, choice: string, amount: number } {
        // For backward compatibility, return the first bet found
        const allBets = this.extractAllBetData(betDetailsLog);
        return allBets.length > 0 ? allBets[0] : { betType: "", choice: "", amount: 0 };
    }

    private formatBetTypeDisplay(type: string) {
        const betTypeNames: { [key: string]: string } = {
            [RouletteBetType.StraightUp]: "Straight Up",
            [RouletteBetType.Split]: "Split",
            [RouletteBetType.Street]: "Street", 
            [RouletteBetType.Triangle]: "Triangle",
            [RouletteBetType.Corner]: "Corner",
            [RouletteBetType.FourNumbers]: "Four Numbers",
            [RouletteBetType.Line]: "Line",
            [RouletteBetType.Column]: "Column",
            [RouletteBetType.Dozen]: "Dozen",
            [RouletteBetType.RedBlack]: "Red/Black",
            [RouletteBetType.OddEven]: "Odd/Even",
            [RouletteBetType.BigSmall]: "Big/Small"
        };

        this.lblBetType.string = betTypeNames[type] || type;
    }

    private formatChoiceDisplay(choice: string, type: string) {
        if (!choice) {
            this.lblChoice.string = "";
            return;
        }

        const choiceNames: { [key: string]: string } = {
            small: "1-18", big: "19-36",
            odd: "Odd", even: "Even", 
            red: "Red", black: "Black",
            dozen1: "1-12", dozen2: "13-24", dozen3: "25-36",
            column1: "Column 1", column2: "Column 2", column3: "Column 3"
        };

        switch (type) {
            case RouletteBetType.BigSmall:
            case RouletteBetType.OddEven: 
            case RouletteBetType.RedBlack:
                this.lblChoice.string = choiceNames[choice] || choice;
                break;
            case RouletteBetType.Dozen:
            case RouletteBetType.Column:
                this.lblChoice.string = choiceNames[type + choice] || choice;
                break;
            case RouletteBetType.Split:
            case RouletteBetType.Street:
            case RouletteBetType.Triangle:
            case RouletteBetType.Corner:
            case RouletteBetType.FourNumbers:
                this.lblChoice.string = choice.includes("-") ? choice.split("-").join(", ") : choice;
                break;
            case RouletteBetType.Line:
                if (choice.includes("-")) {
                    const numbers = choice.split("-");
                    const firstHalf = numbers.slice(0, 3).join(", ");
                    const secondHalf = numbers.slice(3, 6).join(", ");
                    this.lblChoice.string = `${firstHalf}\n${secondHalf}`;
                } else {
                    this.lblChoice.string = choice;
                }
                break;
            default:
                this.lblChoice.string = choice;
        }
    }
}


