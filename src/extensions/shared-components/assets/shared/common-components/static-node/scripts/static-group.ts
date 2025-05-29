import { Component, Layout, Node, _decorator, macro } from "cc";
import { ComponentUtils } from "db://shared-components/shared/utils";
import { StaticNode } from "./static-node";
const { ccclass, property } = _decorator;

@ccclass("StaticGroup")
export class StaticGroup extends Component {
    @property({ type: Node })
    contents: Node[] = [];

    @property(Node)
    container: Node = null;

    @property
    groupId = 0;

    @property({ type: Node })
    dynamicRootNodes: Node[] = [];

    protected initialized = false;

    onLoad() {
        this.dynamicRootNodes.forEach((node) =>
            node.on(Node.EventType.TRANSFORM_CHANGED, () => {
                this.container.getComponentsInChildren(StaticNode).forEach((node) => node.node.active && node.updatePosition());
            })
        );
    }

    lateUpdate() {
        this.initForContents();
    }

    initForContents() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.schedule(this.scheduleMoveNodeToContainer, 0.1, macro.REPEAT_FOREVER);
    }

    scheduleMoveNodeToContainer() {
        this.contents.forEach((child) => {
            this.moveNodeToContainer(child, this.container, this.groupId);
        });
    }

    moveNodeToContainer(content: Node, container: Node, groupId: number) {
        if (content && container && groupId) {
            content.getComponent(Layout)?.updateLayout();
            const staticNodes = content.getComponentsInChildren(StaticNode).filter((node) => node.groupId === groupId);
            staticNodes.forEach((staticNode) => {
                staticNode.init();
                ComponentUtils.moveToOtherNode(staticNode.node, container);
            });
        }
    }
}
