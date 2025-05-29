import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { InGameMenuStore } from "../../in-game-menu/scripts/stores/in-game-menu-store";
import { InGameMenuEvents } from "../../in-game-menu/scripts/stores/in-game-menu-events";

const { render } = Observer;
const { ccclass } = _decorator;

@ccclass("StatisticContainer")
export class StatisticContainer extends NodeContainer {
    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openGuide({ event }: { event: InGameMenuEvents }) {
        if (event === InGameMenuEvents.OPEN_STATISTIC) {
            this.createNode();
        }
    }
}
