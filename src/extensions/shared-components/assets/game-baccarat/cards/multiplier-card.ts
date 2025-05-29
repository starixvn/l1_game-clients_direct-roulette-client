import { _decorator, Component, Label, sp, UIOpacity } from "cc";
import { AnimationUtils } from "../../shared/utils";
import { PokerCard, ServiceCard } from "./../../game/poker-cards/scripts/poker-card";
const { ccclass, property } = _decorator;
@ccclass
export class MultiplierCard extends Component {
    @property(Label)
    lblMultiplier: Label = null;

    @property(PokerCard)
    card: PokerCard = null;

    @property(sp.Skeleton)
    spineTransformCard: sp.Skeleton = null;

    data: ServiceCard;

    setData(data: { item: ServiceCard; value: number }) {
        this.data = data.item;
        this.lblMultiplier.string = `${data.value}x`;
        this.card.setServiceCard(this.data);
        this.card.faceUp();
    }

    async playAnimCard() {
        this.node.getComponent(UIOpacity).opacity = 0;
        await AnimationUtils.fadeIn(this.node, 0.26);
        try {
            this.spineTransformCard.node.active = true;

            AnimationUtils.delayTime(0.1).then(() => {
                this?.card?.node?.isValid && this.card.setGoldenCard(true, false);
            });
            await AnimationUtils.playSpine(this.spineTransformCard, "luckycard", false);
            this.spineTransformCard.node.active = false;
        } catch (e) {}
    }
}
