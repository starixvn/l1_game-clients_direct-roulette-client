import gc from "@sg/game-client-base";
import { _decorator, Component, director } from "cc";
import Observer from "observer";

const { render, handle, observer } = Observer;

const { ConnectSite, App } = gc;

const { ccclass } = _decorator;
@ccclass("UnderMaintenanceVisibility")
@observer
export default class UnderMaintenanceVisibility extends Component {
    @render(App.AppStore, (store) => ({ isUM: store.isUM, isApp: store.isApp }))
    redirectToSessionTimeoutPage({ isUM, isApp }: { isUM: boolean; isApp: boolean }) {
        if (isUM) {
            if (isApp) {
                this.redirectToAppUM();
            } else {
                director.loadScene("under-maintenance");
            }
        }
    }

    @handle(ConnectSite.ConnectSiteHandlers.RedirectToUMPage)
    redirectToAppUM() {}
}
