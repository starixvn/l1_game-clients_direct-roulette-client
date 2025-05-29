import gc from "@sg/game-client-base";
import { _decorator, Label, Node, Sprite, tween, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoPlayButton extends ObserverComponent {
    @property(Label)
    lblNoOfRound: Label = null;

    @property(Sprite)
    sprIconAutoPlay: Sprite = null;

    @property(Node)
    nodeTextAutoPlay: Node = null;

    @property(Node)
    nodeTextStopAutoPlay: Node = null;

    @property(Node)
    nodeBg: Node = null;

    @handle(gc.GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.clickAutoPlay())
    onClickAutoPlay() {
        this.playSoundClick();
    }

    @render(gc.GameCrash.AutoPlay.AutoPlayStore, (store) => store.roundsAutoPlay)
    setNoOfRound(roundsAutoPlay: number) {
        this.lblNoOfRound.string = roundsAutoPlay.toString();
    }

    @render(gc.GameCrash.AutoPlay.AutoPlayStore, (store) => store.isAutoPlay)
    updateAutoPlayButton(isAutoPlay: boolean) {
        this.lblNoOfRound.node.active = this.nodeTextStopAutoPlay.active = isAutoPlay;
        this.sprIconAutoPlay.node.active = this.nodeTextAutoPlay.active = !isAutoPlay;
    }

    @render(gc.GameCrash.AutoPlay.AutoPlayStore, (store) => store.isAutoPlay, { fireImmediately: false })
    showAnimZoomInOut(isAutoPlay: boolean) {
        if (!isAutoPlay) {
            tween(this.nodeBg)
                .to(0.35, { scale: v3(1.2, 1.2, 1.2) }, { easing: "sineOut" })
                .to(0.35, { scale: v3(1, 1, 1) }, { easing: "sineOut" })
                .union()
                .repeat(2)
                .start();
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
