import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../../../../extensions/shared-components/assets/shared/utils";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { Settlements, FormatUtils, Translator } = gc;

@ccclass
export class TotalWinNotice extends ObserverComponent {
    @property(Label)
    lblWinAmount: Label = null;

    @property(Label)
    lblReachMaxWin: Label = null;

    @property({ type: Node })
    othersNoticeNode: Node[] = [];

    private readonly winningSound = "show_winning";

    onLoad(): void {
        super.onLoad();
        this.node.active = false;
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus)
    updateCashoutAmount(settlementStatus: any) {
        if (settlementStatus?.win) {
            this.addSoundWinning();
            ComponentUtils.hideOtherNotices(this.othersNoticeNode);
            this.updateTotalWinAmount(settlementStatus?.bet);
            this.lblReachMaxWin.string = `(${Translator.gameTranslate("reach_max_win")})`;
            this.lblReachMaxWin.node.active = settlementStatus?.reachMaxWin;
            this.showNotice(true);
            ComponentUtils.autoDisappear(this.node, false);
        }
    }

    showNotice(isShow: boolean) {
        this.node.active = isShow;
    }

    updateTotalWinAmount(amount: number) {
        this.lblWinAmount.string = FormatUtils.numberWithCommas(amount, 2);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    addSoundWinning() {
        return this.winningSound;
    }
}
