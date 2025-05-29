import { _decorator, Component, sys } from "cc";
const { ccclass, property } = _decorator;

@ccclass("MobileScale")
export class MobileScale extends Component {
    @property
    scaleRatio = 1.2;

    protected onLoad(): void {
        if (sys.isMobile) {
            this.node.scale = this.node.scale.multiplyScalar(this.scaleRatio);
        }
    }
}
