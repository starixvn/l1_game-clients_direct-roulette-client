import gc from "@sg/game-client-base";
import { _decorator, instantiate, Layout, Node, Prefab, Tween, tween, UITransform, Widget } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { LeaderBoardCashOut } from "./leader-board-cash-out";
import { LeaderBoardMainPlayer } from "./leader-board-main-player";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { GameCrash, Rounds } = gc;

@ccclass
export class LeaderBoard extends ObserverComponent {
    @property(Node)
    nodeOtherPlayers: Node = null;

    @property(LeaderBoardMainPlayer)
    cpnMainPlayer: LeaderBoardMainPlayer = null;

    @property(Prefab)
    pfbItem: Prefab = null;

    @property(Node)
    nodeLeaderBoardMask: Node = null;

    private readonly itemHeight = 24;
    private otherPlayerTween: Tween<Widget> = null;

    onLoad() {
        this.resetOtherPlayers();
        this.setMainPlayerDisplay(false);
        super.onLoad();
    }

    private resetOtherPlayers() {
        this.nodeOtherPlayers.destroyAllChildren();
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.otherPlayers)
    private updateOtherPlayers(otherPlayers: gc.GameCrash.LeaderBoardPlayer[]) {
        if (otherPlayers.length === 0) {
            this.resetOtherPlayers();
            return;
        }

        otherPlayers.forEach((player, index) => {
            let node = this.nodeOtherPlayers.children[index];

            if (!node) {
                node = this.createBoardItem();
            }

            const comp = node.getComponent(LeaderBoardCashOut);
            comp?.setData(player);
        });
        this.updateContentHeight();
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.mainPlayer)
    private updateMainPlayer(mainPlayer: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        if (!mainPlayer) {
            this.setMainPlayerDisplay(false);
            this.scrollOtherPlayer(0);
            return;
        }
        const { halfCashOut } = mainPlayer;

        this.setMainPlayerDisplay(true);
        this.cpnMainPlayer?.setData(mainPlayer);
        this.scrollOtherPlayer(halfCashOut ? this.itemHeight * 2 : this.itemHeight);
        this.updateContentHeight();
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    private resetOtherPlayerScroll(isStartRound: boolean) {
        if (isStartRound) {
            this.scrollOtherPlayer(0);
        }
    }

    updateContentHeight() {
        const mainPlayerContainerTransform = this.cpnMainPlayer.getComponent(UITransform);
        const otherPlayerLayout = this.nodeOtherPlayers.getComponent(Layout);
        otherPlayerLayout?.updateLayout();
        const otherPlayerTransform = this.nodeOtherPlayers.getComponent(UITransform);
        const content = this.nodeOtherPlayers.parent.getComponent(UITransform);
        content.height = otherPlayerTransform.height + (this.cpnMainPlayer.node.active ? mainPlayerContainerTransform.height : 0);
    }

    private scrollOtherPlayer(top: number, isAnimated = true) {
        const otherPlayerWidget = this.nodeOtherPlayers.getComponent(Widget);

        if (isAnimated) {
            this.otherPlayerTween?.stop();
            this.otherPlayerTween = tween(otherPlayerWidget)
                .to(
                    0.2,
                    { editorTop: top },
                    {
                        onUpdate() {
                            otherPlayerWidget.updateAlignment();
                        },
                    }
                )
                .start();
        } else {
            otherPlayerWidget.editorTop = top;
        }
    }

    private createBoardItem(): Node {
        const node = instantiate(this.pfbItem);
        this.nodeOtherPlayers.addChild(node);
        return node;
    }

    private setMainPlayerDisplay(isShow: boolean) {
        this.cpnMainPlayer.node.active = isShow;
    }
}
