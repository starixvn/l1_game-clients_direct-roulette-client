import gc from "@sg/game-client-base";
import { _decorator, Color, Label, Node, Sprite, SpriteAtlas } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { FormatUtils, GameCrash } = gc;

@ccclass
export class RoundHistoryItem extends ObserverComponent {
    @property(Node)
    nodeCountdown: Node = null;

    @property(Label)
    lblCountdown: Label = null;

    @property(Sprite)
    nodeMultiplier: Sprite = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Node)
    nodeInPlay: Node = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    @property
    changeMultiplierLabelColor = false;

    @property({
        type: Color,
        visible: function () {
            return this.changeMultiplierLabelColor;
        },
    })
    labelColors: Color[] = [];

    prefixFrameBg = "";

    public isLastRound = false;

    public roundInfo: gc.RoundHistories.RoundHistory = null;
    readonly START_BET_TIMER = 10;
    readonly END_BET_TIMER = 0;

    displayMultiplier(show: boolean) {
        this.nodeMultiplier.node.active = show;
    }

    displayCountDown(show: boolean) {
        this.nodeCountdown.active = show;
    }

    displayInPlay(show: boolean) {
        this.nodeInPlay.active = show;
    }

    hideAllNodes() {
        this.displayMultiplier(false);
        this.displayCountDown(false);
        this.displayInPlay(false);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundTime)
    renderRoundTime(roundTime: number) {
        if (!this.isCrashed()) {
            if (roundTime <= this.START_BET_TIMER && roundTime > this.END_BET_TIMER) {
                this.lblCountdown.string = roundTime.toString();
                this.hideAllNodes();
                this.displayCountDown(true);
            } else if (roundTime <= 0) {
                this.hideAllNodes();
                this.displayInPlay(true);
            }
        }
    }

    updateMultiplierValue(value: number) {
        this.displayMultiplier(true);
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(value, 2, false)}x`;
        this.updateMultiplierDisplay(value);
    }

    isCrashed() {
        return !!this?.roundInfo?.result;
    }

    @handle(GameCrash.ProvablyFair.ProvablyFairHandler, (handle, roundId: number) => handle.openVerificationLatestRound(roundId))
    onClickRoundItem() {
        this.playSoundClick();
        return this.roundInfo.roundId;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    setPrefixFrame(name: string) {
        this.prefixFrameBg = name;
    }

    protected updateMultiplierDisplay(multiplier: number) {
        const suffixes = ["blue", "yellow", "red"];

        let index = 0;
        if (multiplier > 10) {
            index = 2;
        } else if (multiplier > 5) {
            index = 1;
        } else {
            index = 0;
        }

        this.nodeMultiplier.spriteFrame = this.mainAtlas.getSpriteFrame(`${this.prefixFrameBg}-${suffixes[index]}`);
        if (this.changeMultiplierLabelColor) {
            this.lblMultiplier.color = this.labelColors[index];
        }
    }
}
