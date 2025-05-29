import { Component, ResolutionPolicy, Size, _decorator, macro, screen, view } from "cc";
import { FunctionUtils } from "../../shared/utils";
const { ccclass, property } = _decorator;

@ccclass
export default class DetectResolutionSize extends Component {
    private readonly resolutionSizesInstant = {
        PORTRAIT: {
            width: 448,
            height: 664,
        },
        LANDSCAPE: {
            width: 812,
            height: 410,
        },
    };

    protected onLoad(): void {
        this.detectChangeResolutionSize();
    }

    detectChangeResolutionSize() {
        const isPortrait = FunctionUtils.isPortraitMode();
        const orientation = isPortrait ? macro.ORIENTATION_PORTRAIT : macro.ORIENTATION_LANDSCAPE;
        const { width, height } = isPortrait ? this.resolutionSizesInstant.PORTRAIT : this.resolutionSizesInstant.LANDSCAPE;
        const resolutionPolicy = isPortrait ? ResolutionPolicy.FIXED_HEIGHT : ResolutionPolicy.FIXED_WIDTH;

        view.setOrientation(orientation);
        screen.windowSize = new Size(width, height);
        view.setDesignResolutionSize(width, height, resolutionPolicy);
    }
}
