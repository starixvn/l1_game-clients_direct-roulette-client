import gc from "@sg/game-client-base";
import { _decorator } from 'cc';
import { findWinningChoice } from "../seven-up-down-helper";
import { LedLightTooltipAlignment } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip-alignment";
const { ccclass } = _decorator;

@ccclass('SevenUpDownLedLightToolTip')
export class SevenUpDownLedLightToolTip extends LedLightTooltipAlignment {
    protected onLoad(): void {
        super.onLoad();
    }

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        const roundIdText = `#${ledLightInfo.roundId}`;
        this.roundId.string = roundIdText;
        const { settlementResult, result } = ledLightInfo;
        const rawWinChoice = findWinningChoice(settlementResult);
        const winChoice = rawWinChoice === "seven" ? "7" : rawWinChoice;
        let choiceWin = gc.Translator.gameTranslate(`glossary_${winChoice}`).toUpperCase();
        const diceResult = `(${result["dice1"]},${result["dice2"]})`;

        this.result.string =`${choiceWin} ${diceResult}`;
    }
}


