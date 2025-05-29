import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node } from 'cc';
import { BetHistoryNewBodyItem } from 'db://shared-components/game/bet-history-new/scripts/bet-history-new-body-item';
import { BetHistoryBodyItemType } from 'db://shared-components/game/bet-history/scripts/components/bet-history-body-item';
import { BetChoice } from "../seven-up-down-choices";
const { ccclass, property } = _decorator;

@ccclass
export class BetHistorySevenUpDownBodyItem extends BetHistoryNewBodyItem {
    @property(Label)
    lblBet: Label = null;

    setData(data: BetHistoryBodyItemType): void {
        super.setData(data);

        const { settlementResult, odds, totalAmount, betwin} = data.betHistoryLog;

        if(settlementResult) {
            Object.keys(settlementResult).forEach(choice => {
                let stake = data.betHistoryLog[choice];
                if(+stake > 0) {
                    const odd = this.getFormatOdd(odds[choice]?.toString(), data?.fractionalOddsFormat);
                    this.handleBetOptionItem(choice, odd);
                }
            })
        }

        const winLoss = betwin - totalAmount;
        this.lblBet.color = winLoss >= 0 ? new Color().fromHEX("F1E344") : new Color().fromHEX("FFFFFF");
        this.lblTotalStake.color = winLoss >= 0 ? new Color().fromHEX("F1E344") : new Color().fromHEX("ffffff");
    }

    handleBetOptionItem(choice: string, odd: string) {
        if (choice.includes("seven")) {
            this.lblBet.string = `${gc.Translator.gameTranslate(`glossary_${BetChoice.SEVEN}`)} @ ${odd}`;
        } else {
            this.lblBet.string = `${gc.Translator.gameTranslate(`glossary_${choice}`)} @ ${odd}`;
        }
    }
}


