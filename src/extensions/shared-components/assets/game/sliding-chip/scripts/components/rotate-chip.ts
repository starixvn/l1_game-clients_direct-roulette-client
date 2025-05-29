import { _decorator, Component, tween } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class RotateChip extends Component {
    @property
    degreePerSecond = 360;

    onEnable() {
        tween(this.node)
            .by(1, {
                angle: -this.degreePerSecond,
            })
            .repeatForever()
            .start();
    }
}
