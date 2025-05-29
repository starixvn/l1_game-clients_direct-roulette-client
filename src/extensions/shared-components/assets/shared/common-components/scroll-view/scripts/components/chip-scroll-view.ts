import { _decorator, ScrollView } from "cc";
const { ccclass } = _decorator;

@ccclass
export class ChipScrollView extends ScrollView {
    _onMouseWheel(event, captureListeners) {
        //disable mouse wheel
    }
}
