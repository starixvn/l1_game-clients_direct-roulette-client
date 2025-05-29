import { _decorator, CCInteger, Component, tween } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class RotateNode extends Component {
    @property(CCInteger)
    degreePerSecond = 360;

    protected onEnable(): void {
        tween(this.node).by(1, { angle: -this.degreePerSecond }).repeatForever().start();
    }
}
