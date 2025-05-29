import gc from "@sg/game-client-base";
import { _decorator, Node, Sprite, SpriteAtlas, Tween, tween, UIOpacity, v3 } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../../shared/utils";
const { ccclass, property } = _decorator;
const { Settlements, Rounds } = gc;
const { render, handle } = Observer;

@ccclass
export class ScoreboardCollapseExpandContent extends ObserverComponent {
    private tween: Tween<Node> = null;

    @property(Node)
    nodeBigRoad: Node = null;

    @property(Sprite)
    sprBgPercent1: Sprite = null;

    @property(Sprite)
    sprBgPercent2: Sprite = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    private readonly POSITION_COLLAPSE = 130;
    private readonly POSITION_EXPAND = 0;
    private readonly nameSpriteFrame = "Big-road-board-BG-bot-side";

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    expandScoreboard(isStartRound: boolean) {
        if (isStartRound) {
            this.renderExpandScoreboard(true);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isInRoundTime)
    expandScoreboardNoAnim(isInRoundTime: boolean) {
        if (isInRoundTime) {
            this.renderExpandScoreboard(false);
        }
    }

    renderExpandScoreboard(hasAnimation: boolean) {
        this.nodeBigRoad.getComponent(UIOpacity).opacity = 255;
        if (hasAnimation) {
            this.animChangePositon(this.node, this.POSITION_EXPAND);
        } else {
            this.node.position = v3(this.node.position.x, this.POSITION_EXPAND, 0);
        }
        const spriteFrameName = this.mainAtlas.getSpriteFrame(this.nameSpriteFrame);

        this.sprBgPercent1.spriteFrame = this.sprBgPercent2.spriteFrame = spriteFrameName;
    }

    async renderCollapseScoreboard(hasAnimation: boolean) {
        if (hasAnimation) {
            this.animChangePositon(this.node, this.POSITION_COLLAPSE);
            await FunctionUtils.delay(500);
        } else {
            this.node.position = v3(this.node.position.x, this.POSITION_COLLAPSE, 0);
        }

        this.nodeBigRoad.getComponent(UIOpacity).opacity = 0;
        const spriteFrameName = this.mainAtlas.getSpriteFrame(`${this.nameSpriteFrame}-collapse`);
        this.sprBgPercent1.spriteFrame = this.sprBgPercent2.spriteFrame = spriteFrameName;
    }

    animChangePositon(node: Node, y: number) {
        this.tween && this.tween.stop();
        this.tween = tween(node)
            .to(0.5, { position: v3(this.node.position.x, y, 0) })
            .start();
    }
}
