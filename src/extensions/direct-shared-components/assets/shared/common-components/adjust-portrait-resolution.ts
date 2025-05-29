import { _decorator, Component, ResolutionPolicy, screen, Size, view } from "cc";

const { ccclass } = _decorator;

@ccclass("AdjustPortraitResolution")
export class AdjustPortraitResolution extends Component {
    private readonly portraitResolution = {
        width: 756,
        height: 1344,
    };

    protected onLoad(): void {
        this.adjustResolution();
    }

    adjustResolution() {
        const { width, height } = this.portraitResolution;
        screen.windowSize = new Size(width, height);
        view.setDesignResolutionSize(width, height, ResolutionPolicy.FIXED_WIDTH);
        view.emit("canvas-resize");
    }
}
