import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../../../../extensions/shared-components/assets/shared/utils";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

const { GameCrash, Rounds, FormatUtils, Translator } = gc;

@ccclass
export class CashOutNotice extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property(Label)
    lblReachMaxWin: Label = null;

    @property({ type: Node })
    othersNoticeNode: Node[] = [];

    onLoad(): void {
        this.node.active = false;
        super.onLoad();
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOutNotice, { fireImmediately: false })
    updateCashoutNotice(cashOutNotice: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        const win = cashOutNotice?.reachMaxWin ? cashOutNotice.win : cashOutNotice.cashOutWin;
        this.lblCashOut.string = FormatUtils.numberWithCommas(win, 2);
        this.lblReachMaxWin.string = `(${Translator.gameTranslate("total_cashout_amount_reach_max")})`;
        this.lblReachMaxWin.node.active = cashOutNotice?.reachMaxWin;
        this.showNotice(true);
    }

    showNotice(isShow: boolean) {
        if (isShow) {
            this.node.active = true;
            ComponentUtils.hideOtherNotices(this.othersNoticeNode);
            ComponentUtils.autoDisappear(this.node, false);
        } else {
            this.node.active = false;
        }
    }
}
