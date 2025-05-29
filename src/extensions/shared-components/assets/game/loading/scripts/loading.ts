import { _decorator, Component, Node } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";

const { ccclass, property } = _decorator;
const { observer, render } = Observer;
const { App } = gc;

@ccclass
@observer
export class Loading extends Component {
    @property(Node)
    nodeLoading: Node = null;

    @render(App.AppStore, (store) => store.isLoading)
    setVisibility(visibility: boolean): void {
        this.nodeLoading && (this.nodeLoading.active = visibility);
    }
}
