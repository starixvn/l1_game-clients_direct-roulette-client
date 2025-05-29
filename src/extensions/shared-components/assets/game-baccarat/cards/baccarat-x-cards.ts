import { Component, Label, Node, _decorator, v3 } from "cc";
import Observer from "observer";
import { AnimationUtils } from "../../shared/utils";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class BaccaratXCards extends Component {
    @property(Node)
    cardContainer: Node = null;

    @property(Label)
    lblScore: Label = null;

    protected onLoad(): void {
        this.cardContainer.children.forEach((node) => node.children.forEach((child) => (child.active = false)));
    }

    getCardLocation(index: number) {
        return this.cardContainer.children[index];
    }

    setScore(score: number) {
        this.showScore(true);
        this.lblScore.string = score.toString();
        AnimationUtils.scaleHop(this.lblScore.node.parent, v3(1, 1, 1).multiplyScalar(0.9), 0.3);
    }

    showScore(isShow: boolean) {
        this.lblScore.node.parent.active = isShow;
    }
}
