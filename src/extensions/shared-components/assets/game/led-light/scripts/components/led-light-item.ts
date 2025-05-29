import gc from "@sg/game-client-base";
import { Component, Node, Sprite, SpriteFrame, _decorator } from "cc";
import { LedLightItemModel } from "./led-light-item-model";
const { ccclass, property } = _decorator;

export interface IItemInfo {
    choice: string;
    backgroundName: string;
}

@ccclass("LedLightItem")
export class LedLightItem extends Component {
    @property(Sprite)
    background: Sprite = null;

    @property(Node)
    highlight: Node = null;

    @property({ type: LedLightItemModel })
    itemModel: LedLightItemModel[] = [];

    public ledLightItemInfo: gc.RoundHistories.RoundHistory = null;

    public setLedLightItemInfo(round: gc.RoundHistories.RoundHistory): void {
        this.ledLightItemInfo = round;
        round?.settlementResult && (this.background.spriteFrame = this.getSpriteFrameFromSettlement(round.settlementResult));
    }

    protected getSpriteFrameFromSettlement(settlementResult: gc.GameServiceMessage.TSettlementResult): SpriteFrame {
        let spriteFrame: SpriteFrame = null;
        this.itemModel.forEach((item) => {
            if (settlementResult[item.choiceNames]) {
                spriteFrame = item.backgroundForChoice;
            }
        });

        return spriteFrame;
    }

    public listener = {
        onEnter: (node: Node) => {},
        onLeave: (node: Node) => {},
    };

    onEnable() {
        this.node.on(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    onDisable() {
        this.node.off(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.off(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    eventOnEnter() {
        this.listener.onEnter(this.node);
    }

    eventOnLeave() {
        this.listener.onLeave(this.node);
    }

    setStatusNode(status: boolean) {
        this.node.active = status;
    }
}
