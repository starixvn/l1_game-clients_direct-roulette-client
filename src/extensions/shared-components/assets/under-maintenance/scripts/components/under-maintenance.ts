import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
import Observer from "observer";
import { UMInfo } from "sc-user-service-client/dist/auth";
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;
const { App, DateTimeUtils, Translator, Auth } = gc;

@ccclass
@observer
export default class UnderMaintenance extends Component {
    @property(Label)
    lblMessage: Label = null;

    onLoad() {
        this.ClearRecheckInInterval();
    }

    @handle(Auth.AuthHandlers.ClearRecheckInInterval)
    ClearRecheckInInterval() {}

    @render(App.AppStore, (store) => store.umInfo)
    setUMInfo(umInfo: UMInfo) {
        const startTime = DateTimeUtils.getStringDateByTimeGMT8(umInfo.startTime);
        const endTime = DateTimeUtils.getStringDateByTimeGMT8(umInfo.endTime);
        this.lblMessage.string = Translator.commonTranslate("under_maintenance_time", { startTime, endTime });
    }
}
