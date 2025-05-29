import gc from "@sg/game-client-base";
import { _decorator, Component } from "cc";
import Observer from "observer";

const { ccclass } = _decorator;
const { observer, handle } = Observer;

@ccclass
@observer
export class SessionTimeoutComponent extends Component {
    onLoad() {
        this.ClearRecheckInInterval();
    }

    @handle(gc.Auth.AuthHandlers.ClearRecheckInInterval)
    ClearRecheckInInterval() {}
}
