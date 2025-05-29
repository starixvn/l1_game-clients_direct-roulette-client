import { CCFloat, _decorator, tween } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../../shared/common-components/node-container/node-container";
import { BalanceEffectStore, TWinningEffect, TWinningEffects } from "../stores/balance-effect-store";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass()
export class WinningEffectContainer extends NodeContainer {
    @property(CCFloat)
    duration = 3;

    @render(BalanceEffectStore, (store) => store.winEffectMainPlayer, { fireImmediately: false })
    winEffectMainPlayer(playWinningEffectMainPlayer: TWinningEffect) {
        this.playWinningEffect(playWinningEffectMainPlayer);
    }

    @render(BalanceEffectStore, (store) => store.winEffectAroundTablePlayers, { fireImmediately: false })
    winEffectAroundTablePlayers(winEffectAroundTablePlayers: TWinningEffects) {
        if (winEffectAroundTablePlayers?.winningEffects) {
            winEffectAroundTablePlayers.winningEffects.forEach((winningEffect) => {
                this.playWinningEffect(winningEffect);
            });
        }
    }

    playWinningEffect(playWinningEffectMainPlayer: TWinningEffect) {
        if (playWinningEffectMainPlayer?.effectNode) {
            const winningEffectNode = this.createNode();
            playWinningEffectMainPlayer.effectNode.addChild(winningEffectNode);
            tween(winningEffectNode).delay(this.duration).destroySelf().start();
        }
    }
}
