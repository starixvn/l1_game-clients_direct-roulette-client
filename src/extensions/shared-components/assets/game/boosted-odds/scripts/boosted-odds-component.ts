import gc from "@sg/game-client-base";
import { _decorator, Node, tween } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass("BoostedOddsComponent")
export default class BoostedOddsComponent extends ObserverComponent {
    @property(Node)
    icon: Node | null = null;

    @handle(gc.Notification.BoostedOddsStore, (store) => store.increasePopupCounter())
    openPromotions() {}

    @render(
        gc.Notification.BoostedOddsStore,
        (store) => {
            return {
                isLoadedPrefab: store.isLoadedPrefab,
                boostedOddsCounter: store.boostedOddsCounter,
                boostedOddsIconShowedTimeInMiliseconds: store.boostedOddsIconShowedTimeInMiliseconds,
            };
        },
        { fireImmediately: false }
    )
    showBoostedOddIcon(model: { isLoadedPrefab: boolean; boostedOddsCounter: number; boostedOddsIconShowedTimeInMiliseconds: number }) {
        if (model.isLoadedPrefab) {
            tween(this.icon)
                .call(() => (this.icon.active = true))
                .delay(model.boostedOddsIconShowedTimeInMiliseconds)
                .call(() => (this.icon.active = false))
                .start();
        }
    }
}
