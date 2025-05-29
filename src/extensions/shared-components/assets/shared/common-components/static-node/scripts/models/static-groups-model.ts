import { Node, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass("StaticGroupsModel")
export class StaticGroupsModel {
    @property(Node)
    contents: Node[] = [];

    @property(Node)
    container: Node = null;

    @property
    groupId = 0;

    @property(Node)
    dynamicRootNodes: Node[] = [];
}
