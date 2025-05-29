import gc from "@sg/game-client-base";
import { _decorator, Color, Label, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../../../shared/utils";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameConfigs } = gc;

@ccclass
export default class BetItem extends ObserverComponent {
    @property(Label)
    lblOwnBet: Label = null;

    @property(Label)
    lblTotalBet: Label = null;

    @property(Label)
    lblOdds: Label = null;

    @property(Node)
    chipBox: Node = null;

    @property(Node)
    highlightStatic: Node = null;

    @property(Node)
    highlightAnim: Node = null;

    @property(Node)
    choice: Node = null;

    @property(Label)
    lblBetPercentage: Label = null;

    @property
    enableBoostedOdds = false;

    @property({
        visible: function () {
            return this.enableBoostedOdds;
        },
        type: Node,
    })
    highlightOdds: Node = null;

    @property({
        visible: function () {
            return this.enableBoostedOdds;
        },
    })
    boostedOddsColor = new Color(250, 58, 53, 255);

    private _initialized = false;

    init() {
        if (this._initialized) {
            return;
        }
        ComponentUtils.setEmptyLabels([this.lblOwnBet, this.lblTotalBet, this.lblOdds]);
        this.hideSomeNodes();
        this._initialized = true;
    }

    onLoad() {
        this.init();
        super.onLoad();
    }

    hideSomeNodes() {
        this.highlightStatic.active = false;
        this.highlightAnim.active = false;
    }

    get betChoice() {
        return this.node.name;
    }

    callBet() {
        this.onBet();
    }

    @handle(gc.Bet.BetHandler, (handler, payload: string) => handler.handle(payload))
    onBet() {
        return this.node.name;
    }

    renderOdd(odds: number, fractional: boolean) {
        this.lblOdds.string = gc.FormatUtils.formatOdds(odds, fractional);
    }

    renderOwnBet(ownBet: string) {
        this.lblOwnBet.string = ownBet;
    }

    renderTotalBet(totalBet: string) {
        this.lblTotalBet.string = totalBet;
    }

    public handleHighlightAnim(isActive: boolean) {
        this.highlightAnim.active = isActive;
    }

    public handleHighlightStatic(isActive: boolean) {
        this.highlightStatic.active = isActive;
    }

    renderUserBetPercentage(userBetPercentage: number) {
        this.lblBetPercentage && (this.lblBetPercentage.string = `${userBetPercentage}%`);
    }

    renderbetPercentage(betPercentage: number) {
        this.lblBetPercentage && (this.lblBetPercentage.string = `${betPercentage}%`);
    }

    @render(GameConfigs.GameConfigStore, (store) => store.boostedChoices)
    handleBoostedChoices(boostedChoices: string[]) {
        let isBoostedOdd = false;
        if (this.enableBoostedOdds && boostedChoices?.length > 0 && boostedChoices.includes(this.betChoice)) {
            isBoostedOdd = true;
        }
        this.enableHighLightOdds(isBoostedOdd);
        this.changeOddsColor(isBoostedOdd);
    }

    private enableHighLightOdds(enabled = false) {
        this.highlightOdds !== null && (this.highlightOdds.active = enabled);
    }

    private changeOddsColor(isBoostedOdd = false) {
        if (!this.lblOdds) {
            return;
        }
        if (isBoostedOdd) {
            this.lblOdds.color = new Color(this.boostedOddsColor);
        } else {
            this.lblOdds.color = new Color(255, 255, 255, 255);
        }
    }
}
