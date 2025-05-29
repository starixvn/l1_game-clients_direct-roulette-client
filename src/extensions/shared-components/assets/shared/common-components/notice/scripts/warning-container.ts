import gc from "@sg/game-client-base";
import { Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { WarningCmp } from "./warning-cmp";

const { render } = Observer;

const { Notices, Bet } = gc;
const { ccclass, property } = _decorator;

@ccclass("WarningContainer")
export class WarningContainer extends NodeContainer {
    @property(Prefab)
    processingWarningPrefab: Prefab = null;

    protected currentProcessWarning: Node = null;

    @render(Notices.NoticeStore, (store) => store.warning, { fireImmediately: false })
    showWarning(warning: gc.Notices.Warning) {
        const node = this.createNode();
        const warningCmp = node.getComponent(WarningCmp);
        warningCmp.setData(warning.message);
    }

    @render(Notices.NoticeStore, (store) => store.processingWarning, { fireImmediately: false })
    showProcessingWarning(processingWarning: gc.Notices.Warning) {
        if (!this.prefab || this.currentProcessWarning?.isValid) {
            return;
        }

        const node = instantiate(this.processingWarningPrefab);
        this.node.addChild(node);
        this.currentProcessWarning = node;
        const warningCmp = node.getComponent(WarningCmp);
        warningCmp.setData(processingWarning.message);
    }

    @render(Bet.BetStore, (store) => store.isProcessingBet, { fireImmediately: false })
    hideProcessingWarning(isProcessingBet: boolean) {
        if (!isProcessingBet && this.currentProcessWarning?.isValid) {
            this.currentProcessWarning.destroyAllChildren();
            this.currentProcessWarning = null;
        }
    }
}
