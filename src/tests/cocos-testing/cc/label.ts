import { Color } from "./color";
import { Node } from "./node";

export class Label {
    static CacheMode = {
        NONE: 0,
        BITMAP: 1,
        CHAR: 2,
    };
    string = "string";

    node: any = new Node();

    getComponent = jest.fn();

    color = new Color();

    fontSize = 0;
    lineHeight = 0;

    cacheMode = 2;
}
