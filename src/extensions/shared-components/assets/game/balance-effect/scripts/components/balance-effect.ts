import gc from "@sg/game-client-base";
import { BitmapFont, CCFloat, Label, Layers, Node, _decorator, tween, v3 } from "cc";
import { NodeContainer } from "../../../../shared/common-components/node-container/node-container";
import { TBalanceEffect } from "../stores/balance-effect-store";

const { FormatUtils } = gc;
const { ccclass, property } = _decorator;

@ccclass()
export class BalanceContainer extends NodeContainer {
    @property(CCFloat)
    duration = 1;

    @property(BitmapFont)
    fontIncreaseBalance: BitmapFont = null;

    @property(BitmapFont)
    fontDecreaseBalance: BitmapFont = null;

    @property(CCFloat)
    startY = 0;

    @property(CCFloat)
    destY = 100;

    isIncrease = true;

    protected fontSize = 30;

    updateBalanceWhenPlayerBet(balanceEffect: TBalanceEffect) {
        if (balanceEffect?.effectNode && balanceEffect?.balance) {
            this.updateBalanceEffect(balanceEffect.effectNode, balanceEffect.balance);
        }
    }

    updateBalanceEffect(parent: Node, balance: number): void {
        const balanceEffectNode = new Node();
        balanceEffectNode.layer = Layers.Enum.UI_2D;
        const lblBalance = balanceEffectNode.addComponent(Label);
        lblBalance.string = `${this.isIncrease ? "+" : "-"}${FormatUtils.numberWithCommas(balance, 2)}`;
        lblBalance.font = this.isIncrease ? this.fontIncreaseBalance : this.fontDecreaseBalance;
        lblBalance.lineHeight = 130;
        lblBalance.fontSize = this.fontSize;
        lblBalance.node.position = v3(0, this.startY, 0);
        parent.addChild(balanceEffectNode);
        tween(balanceEffectNode)
            .to(this.duration, { position: v3(0, this.startY + this.destY) })
            .destroySelf()
            .start();
    }
}
