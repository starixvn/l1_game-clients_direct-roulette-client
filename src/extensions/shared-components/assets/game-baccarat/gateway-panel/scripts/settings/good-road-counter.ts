import { _decorator, Label } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { GatewayPanelStore } from "../gateway-panel-store";
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("GoodRoadCounter")
export class GoodRoadCounter extends ObserverComponent {
    @property(Label)
    labelCounter: Label = null;

    @render(GatewayPanelStore, (store) => store.counter)
    renderCounter(counter: number) {
        this.labelCounter.string = counter.toString();

        this.node.active = counter > 0;
    }
}
