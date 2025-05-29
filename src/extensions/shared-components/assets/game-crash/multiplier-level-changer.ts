import gc from "@sg/game-client-base";
import { CCInteger, Node, _decorator } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { ObserverComponent } from "../shared/common-components/observer-component/scripts/observer-component";
const { fadeOut, fadeIn, getUiOpacity } = AnimationUtils;
const { ccclass, property } = _decorator;
const { render } = Observer;
const { GameCrash } = gc;
@ccclass
export class MultiplierLevelChanger extends ObserverComponent {
    @property({ type: CCInteger })
    multiplierLevels = [0, 5, 10];

    currentIndex = 0;

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    private renderMultiplier(multiplier: number) {
        this.updateMultiplierLevel(multiplier);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    startNewRound(isStartPlacingBet: boolean) {
        if (!isStartPlacingBet) {
            return;
        }
        this.resetMultiplierNodes();
    }

    updateMultiplierLevel(multiplier: number) {
        const multipliers = this.multiplierLevels;
        let next = 0;
        for (let index = 0; index < multipliers.length; index++) {
            const m = multipliers[index];
            if (multiplier < m) {
                break;
            }
            next = index;
        }

        const current = next - 1;
        if (current < 0 || this.currentIndex === next) {
            return;
        }
        this.currentIndex = next;
        this.onChangeMultiplier(next);
    }

    private get itemNodes(): Node[] {
        return this.node.children;
    }

    async onChangeMultiplier(current: number) {
        const lastIndex = current - 1;
        const duration = 1;
        this.itemNodes[current].active = true;
        fadeIn(this.itemNodes[current], duration);
        await fadeOut(this.itemNodes[lastIndex], duration);
        this.itemNodes[lastIndex].active = false;
    }

    resetMultiplierNodes() {
        this.currentIndex = 0;
        this.itemNodes.forEach((node, index) => {
            const show = index === 0;
            node.active = show;
            getUiOpacity(node).opacity = show ? 255 : 1;
        });
    }
}
