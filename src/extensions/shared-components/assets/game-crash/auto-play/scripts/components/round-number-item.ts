import gc from "@sg/game-client-base";
import { _decorator, Color, Label, Sprite } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class RoundNumberItem extends ObserverComponent {
    @property(Label)
    lblNoOfRound: Label = null;

    @property(Sprite)
    sprSelectedBg: Sprite = null;

    @property
    noOfRoundSelectedTextColor = "000000";

    @property
    noOfRoundNormalTextColor = "ffffff";

    get value() {
        return +this.node.name;
    }

    setValue(noOfRound: number) {
        this.lblNoOfRound.string = noOfRound.toString();
        this.node.name = noOfRound.toString();
    }

    setSelectedRound(selected: boolean) {
        this.sprSelectedBg.node.active = selected;
        const color = selected ? this.noOfRoundSelectedTextColor : this.noOfRoundNormalTextColor;
        this.lblNoOfRound.color = new Color().fromHEX(color);
    }

    @handle(gc.GameCrash.AutoPlay.AutoPlayHandler, (handle, rounds: number) => handle.updateNoOfRounds(rounds))
    onRoundNumberItemClick(event) {
        this.playSoundClick();
        this.setSelectedRound(true);
        return +event.target.name;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
