import { Color } from "./color";
import { Node } from "./node";

export class Sprite {
    static SizeMode = {
        RAW: "RAW",
    };

    spriteFrame: any = new SpriteFrame();
    node: Node = new Node();

    color: Color = new Color();

    sizeMode = "sizeMode";
}

export class SpriteFrame {}

export class SpriteAtlas {
    getSpriteFrame = jest.fn();
}
