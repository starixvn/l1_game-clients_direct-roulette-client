import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import PromptMessageComponent from "./prompt-message-component";

const { Rounds, Translator } = gc;
const { render, handle } = Observer;
const { ccclass, property } = _decorator;

@ccclass("PromptMessageContainer")
export class PromptMessageContainer extends NodeContainer {
    @property
    shortLockingDuration = true;

    promptMessageComponent: PromptMessageComponent = null;

    @render(Rounds.RoundTimeStore, (store) => store.isLocking)
    renderIsLocking(isLocking: boolean) {
        if (this.shortLockingDuration && isLocking) {
            this.showStopBetMessage();
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartLocking)
    renderIsStartLocking(isStartLocking: boolean) {
        if (!this.shortLockingDuration && isStartLocking) {
            this.showStopBetMessage();
        }
    }

    private showStopBetMessage() {
        this.getComponent()?.showStopBetMessage();
        this.playSound(this.getAudioKeyForLanguage("stop-betting"));
    }

    @render(Rounds.RoundTimeStore, (store) => store.isShowStartBetMessage)
    showStartBetMessage(isStartingRound: boolean) {
        if (isStartingRound) {
            this.scheduleOnce(() => {
                this.getComponent()?.showStartBetMessage();
                this.playSound(this.getAudioKeyForLanguage("start-betting"));
            }, 0.7);
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSound(id: string) {
        return id;
    }

    getAudioKeyForLanguage(name: string): string {
        return `${name}_${Translator.getLanguageId() || "en"}`;
    }

    getComponent() {
        if (!this.promptMessageComponent) {
            const node = this.createNode();
            this.promptMessageComponent = node.getComponent(PromptMessageComponent);
        }

        return this.promptMessageComponent;
    }
}
