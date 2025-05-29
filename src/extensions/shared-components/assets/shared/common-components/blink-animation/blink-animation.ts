import { _decorator, Component, tween, Tween, UIOpacity } from "cc";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent(UIOpacity)
export class BlinkAnimation extends Component {
    @property
    duration = 0.2;

    runningTween: Tween<unknown> = null;

    onEnable() {
        const uiOpacity = this.node.getComponent(UIOpacity);

        this.runningTween = tween(uiOpacity)
            .repeatForever(tween().to(this.duration, { opacity: 0 }).to(this.duration, { opacity: 255 }))
            .start();
    }

    onDisable(): void {
        this.runningTween?.stop();
    }
}
