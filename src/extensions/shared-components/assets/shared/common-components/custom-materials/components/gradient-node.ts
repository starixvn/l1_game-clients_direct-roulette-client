import { Color, Component, Enum, Material, Texture2D, UIRenderer, _decorator } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

enum Type {
    TwoColor,
    UseTexture,
}

@ccclass
@executeInEditMode
export class GradientNode extends Component {
    @property(Material)
    originMaterial: Material = null;

    @property({ type: Enum(Type) })
    type = Type.TwoColor;

    @property({
        type: Texture2D,
        visible: function (this: GradientNode) {
            return this.type === Type.UseTexture;
        },
    })
    albedoTexture: Texture2D = null;

    @property({
        visible: function (this: GradientNode) {
            return this.type === Type.TwoColor;
        },
    })
    topColor: Color = new Color();

    @property({
        visible: function (this: GradientNode) {
            return this.type === Type.TwoColor;
        },
    })
    bottomColor: Color = new Color();
    private cloneMaterial: Material;

    onLoad() {
        this.changeMaterial();
    }

    private changeMaterial() {
        if (!this.originMaterial) {
            return;
        }
        this.cloneMaterial = new Material();
        this.cloneMaterial.copy(this.originMaterial);

        const renderComponent = this.getComponent(UIRenderer);
        if (renderComponent) {
            renderComponent.customMaterial = this.cloneMaterial;
            const useTexture = this.type === Type.UseTexture;
            renderComponent.customMaterial.setProperty("type", useTexture ? 1.0 : 0.0);

            if (useTexture) {
                this.albedoTexture && renderComponent.customMaterial.setProperty("albedoTexture", this.albedoTexture);
            } else {
                renderComponent.customMaterial.setProperty("topColor", this.topColor);
                renderComponent.customMaterial.setProperty("bottomColor", this.bottomColor);
            }
        }
    }

    onFocusInEditor() {
        this.changeMaterial();
    }
}
