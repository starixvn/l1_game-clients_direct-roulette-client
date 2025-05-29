import gc from "@sg/game-client-base";
import { _decorator, Color, instantiate, Label, LabelShadow, Node, Prefab } from "cc";
import Observer from "observer";
import { Dialog } from "../../../shared/common-components/dialogs/dialog";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { GameGuideUtils } from "../../game-guide/scripts/utils/game-guide-utils";
import PromotionItem from "./promotion-item";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("PromotionsTable")
export class PromotionsTable extends ObserverComponent {
    @property(Node)
    promotionContent: Node = null;

    @property(Prefab)
    bodyPrefab: Prefab = null;

    @property(Node)
    termConditionBoard: Node = null;

    @property(Node)
    promotionBoard: Node = null;

    @property(Label)
    promoHeader: Label = null;

    @property(Label)
    termHeader: Label = null;

    @property(Label)
    count: Label = null;

    @property(Node)
    nodeLoading: Node = null;

    @property(Node)
    backgroundCloseNode: Node = null;

    @property(Dialog)
    dialog: Dialog = null;

    onPromotionClick() {
        this.onPromotionTab(true);
    }

    onTermClick() {
        this.onPromotionTab(false);
    }

    protected onEnable(): void {
        this.dialog.onHideComplete = () => {
            GameGuideUtils.showWebViewGuide();
        };
    }

    onPromotionTab(enabled: boolean) {
        this.termHeader.color = enabled ? Color.WHITE : new Color(254, 246, 0);
        this.promoHeader.color = enabled ? new Color(254, 246, 0) : Color.WHITE;
        this.promotionBoard.active = enabled;
        this.termConditionBoard.active = !enabled;
        this.promoHeader.node.getComponent(LabelShadow).enabled = enabled;
        this.termHeader.node.getComponent(LabelShadow).enabled = !enabled;
    }

    buildBodyRow(data: gc.Notification.PromotionModel): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        bodyRow.getComponent(PromotionItem).setData(data);

        return bodyRow;
    }

    @render(gc.Notification.BoostedOddsStore, (store) => store.isLoadingIcon, { fireImmediately: false })
    showHideLoading(isLoadingIcon: boolean) {
        this.nodeLoading.active = isLoadingIcon;
        this.backgroundCloseNode.active = false;
    }

    showPromotions(model: Array<gc.Notification.PromotionModel>) {
        this.count.string = model?.length.toString();
        this.count.node.parent.active = true;

        model.forEach((data) => {
            this.promotionContent.addChild(this.buildBodyRow(data));
        });
    }
    @render(gc.Notification.BoostedOddsStore, (store) => store.isLoadingIcon, { fireImmediately: false })
    showBoostedOddIcon(isLoadingIcon: boolean) {
        isLoadingIcon && this.dialog.hide();
    }
}
