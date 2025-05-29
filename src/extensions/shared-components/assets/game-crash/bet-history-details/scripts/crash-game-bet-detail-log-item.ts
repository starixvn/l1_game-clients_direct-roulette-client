import gc from "@sg/game-client-base";
import { _decorator, Color, Label } from "cc";

import { BaseBetDetailLogItem, BetDetailLogItemType } from "../../../game/bet-history/scripts/components/bet-detail/bet-detail-log-item";

const { ccclass, property } = _decorator;
const { DateTimeUtils, FormatUtils, Translator } = gc;

export interface CrashGameBetDetailsLog {
    amount: number;
    time: string;
    action: string;
    rate: number;
    rebet: boolean;
    multiplier: number;
    winAmount: number;
}

const ActionName = {
    CASH_OUT: "cashOut",
    HALF_CASH_OUT: "halfCashOut",
    CRASH: "crash",
    REFUND: "refund",
    BET: "bet",
};

@ccclass
export class CrashGameBetDetailLogItem extends BaseBetDetailLogItem {
    @property(Label)
    lblAction: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblBet: Label = null;

    @property(Label)
    lblOtherAction: Label = null;

    setCrashNodeVisibility(status: boolean) {
        this.lblOtherAction.node.active = status;
        this.lblAction.node.active = !status;
    }

    setData(data: BetDetailLogItemType) {
        super.setData(data);
        const { amount, multiplier, winAmount, action } = data.betDetailsLog as CrashGameBetDetailsLog &
            gc.BetHistory.DynamicObject<object>;

        let actionName = "";
        let isShowOtherAction = false;
        switch (action) {
            case ActionName.CASH_OUT:
                actionName = "cashout";
                break;
            case ActionName.HALF_CASH_OUT:
                actionName = "cashout_50%";
                break;
            case ActionName.CRASH:
                actionName = "crash";
                isShowOtherAction = true;
                break;
            case ActionName.REFUND:
                actionName = "glossary_refund";
                isShowOtherAction = true;
                break;
            default:
                actionName = "bet_accepted";
                isShowOtherAction = true;
                break;
        }

        const lblAction = isShowOtherAction ? this.lblOtherAction : this.lblAction;
        lblAction.string = Translator.gameTranslate(actionName);
        this.lblBet.string = FormatUtils.numberWithCommas(amount, 2);
        this.lblMultiplier.string = multiplier ? `${FormatUtils.numberWithCommas(multiplier, 2, false)}x` : "";
        this.lblWin.string = FormatUtils.numberWithCommas(winAmount, 2);
        this.lblWin.node.active = action !== ActionName.BET;

        this.setHighlightTicketDetail(winAmount > 0);
    }
    setHighlightTicketDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblMultiplier.color = color;
        this.lblBet.color = color;
    }
}
