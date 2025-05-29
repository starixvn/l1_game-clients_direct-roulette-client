import { _decorator, Component } from "cc";
import { FlashLightController } from "./flash-light-controller";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("FlashLightBase")
@requireComponent(FlashLightController)
export class FlashLightBase extends Component {
    protected controller: FlashLightController;
    onLoad() {
        this.controller = this.getComponent(FlashLightController);
    }

    protected start() {
        this.initStart();
    }

    protected initStart() {}
}
