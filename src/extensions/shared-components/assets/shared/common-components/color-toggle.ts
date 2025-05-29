import { _decorator, Color, Component, macro, Toggle, UIRenderer } from "cc";
const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent(UIRenderer)
export default class ColorToggle extends Component {
    @property(Color)
    checkColor: Color = new Color();

    @property(Color)
    uncheckColor: Color = new Color();

    @property(Toggle)
    toggle: Toggle = null;

    private initialized = false;
    private uiRenderer: UIRenderer = null;

    onEnable() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.uiRenderer = this.node.getComponent(UIRenderer);
        this.schedule(this.updateCheckColor.bind(this), 1 / 30, macro.REPEAT_FOREVER);
    }

    updateCheckColor() {
        this.uiRenderer.color = this.toggle?.isChecked ? this.checkColor : this.uncheckColor;
    }
}
