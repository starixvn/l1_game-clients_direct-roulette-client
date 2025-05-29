import { _decorator } from "cc";
import { AutoScaleWidget } from "../../shared/common-components/auto-scale-widget";
import { FunctionUtils } from "../../shared/utils";
const { ccclass } = _decorator;

@ccclass("IpadAutoScaleWidget")
export class IpadAutoScaleWidget extends AutoScaleWidget {
    isIpad(): boolean {
        return FunctionUtils.isIpad();
    }

    protected updateDisplay(): void {
        if (!this.isIpad()) {
            return;
        }
        super.updateDisplay();
    }
}
