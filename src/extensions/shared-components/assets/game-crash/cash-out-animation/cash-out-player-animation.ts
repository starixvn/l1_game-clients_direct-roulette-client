import gc from "@sg/game-client-base";
import { CCString, Color, Label, Node, UITransform, _decorator, math, sp, tween, v3 } from "cc";
import { random } from "lodash-es";
import Observer from "observer";
import { NodeContainer } from "../../shared/common-components/node-container/node-container";
import { AnimationUtils, ComponentUtils } from "../../shared/utils";
const { render } = Observer;
const { ccclass, property } = _decorator;
const { GameCrash, FormatUtils } = gc;

export const CashOutAnim = {
    MainPlayer: "main",
    OtherPlayer: "user",
};

export const ColorWinValue = {
    MainPlayer: "ECB90A",
    OtherPlayer: "4d7fb6",
};

enum PathBonesIndex {
    Main = 0,
    Player = 1,
}

@ccclass
export class CashOutPlayerAnimation extends NodeContainer {
    @property(Node)
    containerSpaceman: Node = null;

    @property(CCString)
    pathBones = [];

    protected currentPosition: math.Vec3 = null;

    protected getScalar() {
        return 0.5;
    }

    protected getRandomPositionX() {
        return random(-200, 100);
    }

    protected getRandomPositionY() {
        return -random(20, 50);
    }

    @render(GameCrash.CrashOtherPlayer.OtherPlayerStore, (store) => store.otherPlayer, { fireImmediately: false })
    renderOtherPlayerCashOut(otherPlayer: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        if (otherPlayer) {
            const player = otherPlayer?.cashOut || otherPlayer?.halfCashOut;
            const winAmount = player?.win || 0;
            this.createCashOutPlayer(winAmount);
        }
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOutNotice, { fireImmediately: false })
    renderMainPlayerCashOutFull(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        cashOut && this.createCashOutMainPlayer(cashOut);
    }

    createCashOutMainPlayer(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        this.createCashOutPlayer(cashOut?.win || 0, true);
    }

    protected createCashOutPlayer(winValue: number, isMainPlayer = false) {
        const node = this.createNode();
        const randomPosition = this.getRandomPosition(node);
        ComponentUtils.moveToOtherNode(node, this.containerSpaceman);
        if (node?.children[0]) {
            const animationName = isMainPlayer ? CashOutAnim.MainPlayer : CashOutAnim.OtherPlayer;
            const spine = node?.getComponentInChildren(sp.Skeleton);
            spine.sockets[0].path = isMainPlayer ? this.pathBones[PathBonesIndex.Main] : this.pathBones[PathBonesIndex.Player];
            this.handleWinnings(spine, winValue, isMainPlayer);
            this.handleAnimation(node, spine, animationName, randomPosition);
        }
    }

    handleWinnings(spine: sp.Skeleton, winValue: number, isMainPlayer: boolean) {
        const lblWin = spine.node?.getComponentInChildren(Label);
        if (lblWin) {
            lblWin.string = FormatUtils.numberWithCommas(winValue, 2);
            lblWin.color = new Color().fromHEX(isMainPlayer ? ColorWinValue.MainPlayer : ColorWinValue.OtherPlayer);
        }
    }

    getRandomPosition(node: Node) {
        this.currentPosition = this.containerSpaceman
            .getComponent(UITransform)
            .convertToNodeSpaceAR(node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
        return v3(this.currentPosition.x + this.getRandomPositionX(), this.getRandomPositionY());
    }

    handleAnimation(node: Node, spine: sp.Skeleton, animationName: string, randomPosition: math.Vec3) {
        const animationDuration = spine?.findAnimation(animationName).duration;
        const actions = [
            tween(node).call(() => {
                spine && AnimationUtils.playSpine(spine, animationName);
            }),
            tween(node).delay(animationDuration).destroySelf(),
        ];

        if (randomPosition) {
            actions.push(this.handleAnimRandomPosition(node, randomPosition, animationDuration));
        }

        node &&
            tween(node)
                .parallel(...actions)
                .start();
    }

    handleAnimRandomPosition(node: Node, randomPosition: math.Vec3, animationDuration: number) {
        return tween(node).to(animationDuration, {
            position: randomPosition,
            scale: v3(1, 1, 1).multiplyScalar(this.getScalar()),
        });
    }
}
