import { Node } from "cc";
import { click, getIdentifier } from "./cocos-utils";

export class Integration {
    static click(id: string): void {
        const node = Integration.node(id);

        node && click(node);
    }

    static label(id: string): string {
        const identifier = getIdentifier(id);

        if (identifier.isLabel) {
            return identifier.label.string;
        }

        return undefined;
    }

    static node(id: string): Node {
        return getIdentifier(id)?.node;
    }
}

globalThis.Integration = Integration;

declare global {
    var Integration: Integration;
}
