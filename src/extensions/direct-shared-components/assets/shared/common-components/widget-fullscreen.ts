import { _decorator, Component, Widget } from "cc";

const { ccclass } = _decorator;

@ccclass("WidgetFullscreen")
export class WidgetFullscreen extends Component {
    protected onLoad(): void {
        this.addWidgetFullscreen();
    }

    addWidgetFullscreen() {
        let widget = this.node?.getComponent(Widget);
        if (!widget) {
            widget = this.node?.addComponent(Widget);
        }
        widget.isAlignLeft = true;
        widget.left = 0;
        widget.isAlignRight = true;
        widget.right = 0;
        widget.isAlignTop = true;
        widget.top = 0;
        widget.isAlignBottom = true;
        widget.bottom = 0;
        widget.enabled = true;
    }
}
