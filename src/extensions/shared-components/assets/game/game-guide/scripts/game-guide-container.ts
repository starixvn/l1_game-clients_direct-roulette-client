import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { InGameMenuEvents } from "../../in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "../../in-game-menu/scripts/stores/in-game-menu-store";
import WebViewGuide from "./web-view-guide";

const { render } = Observer;
const { ccclass } = _decorator;

@ccclass("GameGuideContainer")
export class GameGuideContainer extends NodeContainer {
    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openGuide({ event }: { event: InGameMenuEvents }) {
        if (event === InGameMenuEvents.OPEN_GUIDE) {
            this.openDialog("");
        } else if (event.includes("open_guide_scroll")) {
            const words = event.split("_");
            const id = words[words.length - 1];
            this.openDialog(id);
        }
    }

    protected openDialog(scrollToId: string) {
        const guide = this.createNode();
        guide.getComponent(WebViewGuide)?.initUrl("", scrollToId);
    }

    @render(gc.Dialogs.DialogsStore, (store) => store.forceClosed, { fireImmediately: false })
    popupVisibility(forceClosed: any) {
        forceClosed && this.node.destroyAllChildren();
    }
}
