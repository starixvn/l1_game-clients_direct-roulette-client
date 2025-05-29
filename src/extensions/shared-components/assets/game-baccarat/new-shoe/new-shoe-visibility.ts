import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
const { render, handle, observer } = Observer;
const { ccclass, property } = _decorator;

@ccclass
export class NewShoeVisibility extends ObserverComponent {
    @property({ type: Node })
    visibleNodes: Node[] = [];

    @property({ type: Node })
    hideNodes: Node[] = [];

    @render(gc.GameBaccaratX.Shoe.ShoeStore, (store) => store.newShoePhase)
    showNode(newShoePhase: boolean) {
        this.visibleNodes.forEach((node) => (node.active = newShoePhase));
        this.hideNodes.forEach((node) => (node.active = !newShoePhase));
    }
}
