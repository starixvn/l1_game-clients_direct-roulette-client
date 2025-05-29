import gc from "@sg/game-client-base";
import { _decorator, sp } from "cc";
import { sample } from "lodash-es";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "../../../../shared/utils";
const { ccclass, property } = _decorator;

const { Rounds } = gc;
const { render } = Observer;

@ccclass("Dealer")
export class Dealer extends ObserverComponent {
    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    protected isRunAnimStartBet = false;
    protected isRunAnimDealer = false;

    get listAnim() {
        return ["idle"];
    }

    get animStartBet() {
        return "start-bet";
    }

    onLoad(): void {
        super.onLoad();
        this.playlistAnim();
    }

    @render(Rounds.RoundTimeStore, (store) => store.isShowStartBetMessage)
    async handleAnimStartBet(isStartRound: boolean) {
        if (isStartRound && this.spine) {
            this.isRunAnimStartBet = true;
            this.isRunAnimDealer = false;
            await AnimationUtils.playSpine(this.spine, this.animStartBet);
            this.isRunAnimStartBet = false;
            await this.playlistAnim();
        }
    }

    async playlistAnim() {
        const nameAnim = sample(this.listAnim);
        if (!this.isRunAnimStartBet && !this.isRunAnimDealer && this.spine) {
            this.isRunAnimDealer = true;
            await AnimationUtils.playSpine(this.spine, nameAnim, true);
        }
    }
}
