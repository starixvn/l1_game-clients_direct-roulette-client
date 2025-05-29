import { Node } from "./node";

export class Component {
    constructor() {}
    node = new Node();
    enabled = true;
    getComponent = jest.fn();
    getComponents = jest.fn();
    getComponentsInChildren = jest.fn();
    getComponentInChildren = jest.fn();
    destroy = jest.fn();

    onEnable() {}

    protected onDestroy() {}

    onDisable() {}
}
