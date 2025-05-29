import { _decorator, Component, Label, tween } from "cc";
import gc from "@sg/game-client-base";

const { ccclass, property } = _decorator;
const { FormatUtils } = gc;

@ccclass
export class JackpotNotification extends Component {
    @property(Label)
    lblPlayerName: Label = null;

    @property(Label)
    lblAmount: Label = null;

    @property(Label)
    lblGameName: Label = null;

    setData(winnerName: string, amount: number, gameName: string) {
        this.lblPlayerName.string = winnerName;
        this.lblAmount.string = FormatUtils.numberWithCommas(amount, 2);
        this.lblGameName.string = gameName;

        tween(this.node)
            .delay(6)
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
