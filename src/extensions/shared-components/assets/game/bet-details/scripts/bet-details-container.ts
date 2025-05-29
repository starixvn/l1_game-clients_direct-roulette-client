import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { BetTicketDetails } from "./bet-ticket-details";
const { ccclass, property } = _decorator;
const { handle, render } = Observer;
const { BetDetailsNew } = gc;

@ccclass
export class BetDetailsContainer extends NodeContainer {
    @render(BetDetailsNew.BetDetailsStore, (store) => store.betDetailsUrl, { fireImmediately: false })
    renderContent(betDetailsUrl: string) {
        if (betDetailsUrl === "") {
            return;
        }
        const guide = this.createNode();
        guide.getComponent(BetTicketDetails)?.openBetDetails(betDetailsUrl);
    }

    @render(gc.Dialogs.DialogsStore, (store) => store.forceClosed, { fireImmediately: false })
    popupVisibility(forceClosed: any) {
        forceClosed && this.node.destroyAllChildren();
    }
}
