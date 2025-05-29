import { _decorator } from "cc";
import Observer from "observer";
import SCScoreboard from "sc-scoreboards";
import { BaccaratBigRoad } from "../../../../game/scoreboards/scripts/components/baccarat/big-road/baccarat-big-road";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { GatewayPanelStore } from "../gateway-panel-store";
const { ccclass, property, requireComponent } = _decorator;
const { render, handle } = Observer;
@ccclass("GoodRoadPatternChanger")
@requireComponent(BaccaratBigRoad)
export class GoodRoadPatternChanger extends ObserverComponent {
    @property(BaccaratBigRoad)
    bigRoad: BaccaratBigRoad = null;

    @render(GatewayPanelStore, (store) => store.patterns)
    updateSelectedPatterns(patterns: SCScoreboard.ColumnLengthPattern[]) {
        this.bigRoad?.updateGoodRoadPatterns(patterns);
    }
}
