import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { DemoHandler } from "./demo-handlers";

const { ccclass, property } = _decorator;

const { handle } = Observer;

@ccclass
export class Demo extends ObserverComponent {
    onLoad() {
        super.onLoad();
        gc.initMobxLogger();
        const configs = new gc.GameServiceMessage.GameConfigs();
        configs.chips = ["1", "5", "10", "50", "100", "200", "500", "1000", "2000"];
        configs.minBet = 1;
        configs.maxBet = 2000;
        this.setDemoGameConfigs(configs);
    }

    @handle(DemoHandler)
    setDemoGameConfigs(gameConfigs: gc.GameServiceMessage.GameConfigs) {
        return gameConfigs;
    }
}
