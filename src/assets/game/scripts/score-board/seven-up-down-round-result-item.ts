import gc from "@sg/game-client-base";
import { _decorator, Component, Node, Sprite, SpriteAtlas } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SevenUpDownRoundResultItem')
export class SevenUpDownRoundResultItem extends Component {
    @property({ type: Node })
    dices: Node[] = [];

    @property(Node)
    nodeMultiplier: Node = null;

    @property(Node)
    nodeTotalPoint: Node = null;

    @property(Node)
    highlight: Node = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    setData(data: any) {
        const { result } = data;

        let totalPoint = 0;

        if (this.nodeMultiplier) {
            this.nodeMultiplier.active = false;
        }
        
        Object.keys(result).forEach((key) => {
            if (key === 'multiplier') {
                this.nodeMultiplier.active = true;
                this.nodeMultiplier.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(`${result[key]?.value}x`);
            }

            const dice = this.dices.find((item) => item.name === key);
            if (dice) {
                dice.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(`scoreboard-xx${result[key]}`);
                totalPoint += result[key];
            }
        });
        
        if (this.nodeTotalPoint) {
            this.nodeTotalPoint.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(`scoreboard-numer-${totalPoint}`);
        }
    }
}


