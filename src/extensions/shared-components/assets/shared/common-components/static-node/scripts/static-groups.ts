import { Node, _decorator } from "cc";
import { StaticGroupsModel } from "./models/static-groups-model";
import { StaticGroup } from "./static-group";
import { StaticNode } from "./static-node";
const { ccclass, property } = _decorator;

@ccclass("StaticGroups")
export class StaticGroups extends StaticGroup {
    @property({ type: Node, visible: false, override: true })
    container: Node = null;

    @property({ visible: false, override: true })
    groupId = 0;

    @property({ type: Node, visible: false, override: true })
    dynamicRootNodes: Node[] = [];

    @property(StaticGroupsModel)
    staticGroups: StaticGroupsModel[] = [];

    onLoad() {
        this.staticGroups.forEach((staticGroup) => {
            staticGroup.dynamicRootNodes.forEach((node) =>
                node.on(Node.EventType.TRANSFORM_CHANGED, () => {
                    staticGroup.container.getComponentsInChildren(StaticNode).forEach((node) => node.node.active && node.updatePosition());
                })
            );
        });
    }

    scheduleMoveNodeToContainer() {
        this.staticGroups.forEach((staticGroup) => {
            this.contents.forEach((content) => {
                this.moveNodeToContainer(content, staticGroup?.container, staticGroup?.groupId);
            });

            staticGroup.contents.forEach((content) => {
                if (!this.contents?.includes(content)) {
                    this.moveNodeToContainer(content, staticGroup?.container, staticGroup?.groupId);
                }
            });
        });
    }
}
