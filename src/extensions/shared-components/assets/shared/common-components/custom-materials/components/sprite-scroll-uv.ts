import { _decorator, Component, Sprite, v2, Vec2 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SpriteScrollUV")
export class SpriteScrollUV extends Component {
    @property({ tooltip: "Pixels per second" })
    speed = v2(200, 0);

    sprite: Sprite = null;
    originalSize: Vec2 = null;
    private deltaTime = 0;

    onLoad() {
        this.sprite = this.getComponent(Sprite);
        if (this.sprite) {
            const frame = this.sprite.spriteFrame;
            if (frame) {
                this.originalSize = v2(frame.width, frame.height);
            }
        }
    }

    update(dt: number) {
        if (!this.sprite || !this.originalSize) {
            return;
        }

        this.deltaTime += dt;

        const offset = v2((this.deltaTime * this.speed.x) / this.originalSize.x, (this.deltaTime * this.speed.y) / this.originalSize.y);
        this.sprite.getSharedMaterial(0).setProperty("offset", offset);
    }
}
