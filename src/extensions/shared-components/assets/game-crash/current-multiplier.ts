import gc from "@sg/game-client-base";
import { Label, Node, UIOpacity, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { FormatUtils, GameCrash } = gc;

@ccclass("current_multiplier")
export class CurrentMultiplier extends ObserverComponent {
    @property(Label)
    lblCurrentMultiplier: Label = null;

    @property(Node)
    nodeMultiplierText: Node = null;

    @property(Node)
    nodeCrashText: Node = null;

    private readonly crashSound = "plane_explose";
    private readonly planeFlySound = "plane_flying";

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    private setCurrentMultiplier(multiplier: number) {
        this.setCurrMultiplierValue(multiplier);
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.rocketState)
    setDisplayMultiplier(rocketState: string) {
        if (rocketState === GameCrash.RocketState.ONLAND) {
            this.setVisibility(false);
        } else {
            this.setVisibility(true);
            this.setDisplayBottomText(rocketState === GameCrash.RocketState.CRASHED);
        }
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.playSoundRocketFly)
    setSoundPlaneFly(playSoundRocketFly: string) {
        playSoundRocketFly ? this.playSoundPlaneFly() : this.stopSoundPlaneFly();
    }

    setVisibility(status: boolean) {
        this.getComponent(UIOpacity).opacity = status ? 255 : 0;
    }

    setCurrMultiplierValue(multiplier: number) {
        this.lblCurrentMultiplier.string = `${FormatUtils.numberWithCommas(multiplier, 2, false)}x`;
    }

    setDisplayBottomText(isCrashed: boolean) {
        this.nodeCrashText.active = isCrashed;
        this.nodeMultiplierText && (this.nodeMultiplierText.active = !isCrashed);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundCrash() {
        return this.crashSound;
    }

    @handle(gc.Audios.AudioHandler, (handle, audioId: string) => handle.playStoppableSFX(audioId))
    playSoundPlaneFly() {
        return this.planeFlySound;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.stopStoppableSFX(id))
    stopSoundPlaneFly() {
        return this.planeFlySound;
    }
}
