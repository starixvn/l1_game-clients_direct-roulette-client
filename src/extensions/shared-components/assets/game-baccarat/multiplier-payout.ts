import gc from "@sg/game-client-base";
import { Label, _decorator, director } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { FormatUtils, GameBaccaratX } = gc;

export enum MultiplierPayoutEvent {
    Clear = "Clear",
}

@ccclass
export class MultiplierPayout extends ObserverComponent {
    labels: Label[] = [];
    onLoad() {
        this.labels = this.getComponentsInChildren(Label);
        this.cleanLabels();
        const scene = director.getScene();
        scene?.on(MultiplierPayoutEvent.Clear, this.cleanLabels, this);
        super.onLoad();
    }
    onDestroy(): void {
        const scene = director.getScene();
        scene?.off(MultiplierPayoutEvent.Clear, this.cleanLabels, this);
        super.onDestroy();
    }

    cleanLabels() {
        this.labels.forEach((label) => {
            label.string = "";
            label.node.parent.active = false;
        });
    }

    @render(GameBaccaratX.Multiplier.BaccaratMultipliersStore, (store) => store.possiblePayout)
    renderPossiblePayout(possiblePayout: gc.GameBaccaratX.Multiplier.ChoicesMultipliers) {
        this.labels.forEach((label) => {
            const choice = label.node.name;
            const parentNode = label.node.parent;
            if (possiblePayout[choice]) {
                parentNode.active = true;
                const value = possiblePayout[choice].value;
                label.string = `${+(+value).toFixed(2)}x`;
            } else {
                parentNode.active = false;
                label.string = ``;
            }
        });
    }
}
