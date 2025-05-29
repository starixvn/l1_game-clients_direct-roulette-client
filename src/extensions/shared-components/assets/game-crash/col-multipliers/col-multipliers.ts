import { _decorator, instantiate, Node, Prefab, Tween, tween, UITransform, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { ColMultiplierItem } from "./col-multiplier-item";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class ColMultipliers extends ObserverComponent {
    @property(Node)
    nodeMultipliersContainer: Node = null;

    @property(Prefab)
    prfMultiplierItem: Prefab = null;

    multiplierList = [1, 2, 3, 4, 8];
    multiplierItemHeight: number;
    scrollTween: Tween<Node>;
    multiplierBottom = 0;
    multiplierTop = 0;

    onLoad() {
        this.multiplierItemHeight = instantiate(this.prfMultiplierItem).getComponent(UITransform).height;
        this.initMultiplierList();
        super.onLoad();
    }

    initMultiplierList() {
        let lastMultiplier = this.multiplierList[this.multiplierList.length - 1];
        while (lastMultiplier < 2000) {
            let newMultiplier = Math.round(lastMultiplier * 1.5);
            if (newMultiplier > 2000) {
                newMultiplier = 2000;
            }
            this.multiplierList.push(newMultiplier);
            lastMultiplier = newMultiplier;
        }

        this.nodeMultipliersContainer.destroyAllChildren();
        this.multiplierList.forEach((multiplier) => {
            this.addItem(multiplier);
        });
        this.resetMultiplierRange();
    }

    resetMultiplierRange() {
        this.multiplierBottom = this.multiplierList[0];
        this.multiplierTop = this.multiplierList[1];
    }

    addItem(multiplier: number) {
        const node = instantiate(this.prfMultiplierItem);
        node.name = multiplier.toString();
        this.nodeMultipliersContainer.addChild(node);

        const multiplierContainerTransform = this.nodeMultipliersContainer.getComponent(UITransform);
        const itemPosY = multiplierContainerTransform.height;
        node.position = v3(0, itemPosY, 0);
        multiplierContainerTransform.height = this.multiplierItemHeight + itemPosY;
        const comp = node.getComponent(ColMultiplierItem);
        multiplier === 1 && comp.setPositionForMultiplier1();
        comp.setMultiplier(multiplier);
    }

    private findMultiplierIndex(multiplier: number): number {
        return this.multiplierList.findIndex((item) => item >= multiplier);
    }

    scrollDown(offsetY: number, animated: boolean) {
        if (animated) {
            this.scrollTween?.stop();
            this.scrollTween = tween(this.nodeMultipliersContainer)
                .by(0.1, {
                    position: v3(0, offsetY, 0),
                })
                .start();
        } else {
            this.nodeMultipliersContainer.position = this.nodeMultipliersContainer.position.add(v3(0, offsetY, 0));
        }
    }

    scrollUp() {
        this.scrollTween?.stop();
        this.resetMultiplierRange();
        this.scrollTween = tween(this.nodeMultipliersContainer)
            .to(
                1,
                {
                    position: v3(0, 0, 0),
                },
                { easing: "sineOut" }
            )
            .start();
    }

    handleMultiplier(multiplier: number) {
        const currentIndex = this.findMultiplierIndex(multiplier);
        const multiplierTop = this.multiplierList[currentIndex];

        if (multiplierTop > this.multiplierTop) {
            this.multiplierTop = multiplierTop;
            this.multiplierBottom = this.multiplierList[currentIndex - 1];
        }
    }

    calcMultiplierHeight(multiplier: number): number {
        return ((multiplier - this.multiplierBottom) * this.multiplierItemHeight) / (this.multiplierTop - this.multiplierBottom);
    }

    convertWorldPosition(node: Node) {
        return node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
    }

    handleScroll(rocket: Node, multiplier: number, animated: boolean) {
        this.handleMultiplier(multiplier);

        const rocketWorldPos = this.convertWorldPosition(rocket);
        const multiplierHeight = this.calcMultiplierHeight(multiplier);
        const bottomNode = this.nodeMultipliersContainer.getChildByName(`${this.multiplierBottom}`);
        const calcMultiplierPosY = this.convertWorldPosition(bottomNode).y + multiplierHeight;

        const deltaY = rocketWorldPos.y - calcMultiplierPosY;
        this.scrollDown(deltaY, animated);
    }
}
