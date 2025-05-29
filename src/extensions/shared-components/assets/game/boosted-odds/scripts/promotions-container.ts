import gc from "@sg/game-client-base";
import { Node, _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { GameGuideUtils } from "../../game-guide/scripts/utils/game-guide-utils";
import { PromotionsTable } from "./promotions-table";

const { ccclass } = _decorator;
const { render } = Observer;

@ccclass("PromotionsContainer")
export class PromotionsContainer extends NodeContainer {
    wrapperNode: Node = null;
    table: PromotionsTable = null;
    popupCounter = 0;

    @render(
        gc.Notification.BoostedOddsStore,
        (store) => {
            return {
                popupCounter: store.popupCounter,
                promotions: store.promotions,
            };
        },
        { fireImmediately: false }
    )
    async showPromotionsPopup(data: { popupCounter: number; promotions: Array<gc.Notification.PromotionModel> }) {
        if (data.popupCounter === this.popupCounter) {
            return;
        }
        await GameGuideUtils.hideWebViewGuide();

        this.popupCounter = data.popupCounter;
        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
            this.table = this.wrapperNode.getComponent(PromotionsTable);
        }

        this.clearOldTable();
        this.table.showPromotions(data.promotions);
    }

    clearOldTable() {
        this.table.promotionContent.destroyAllChildren();
    }
}
