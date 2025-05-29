import { _decorator } from "cc";
import { ErrorMessage } from "db://shared-components/splash/scripts/error-message";
import { RandomWaitingMessage } from "./random-waiting-message";

const { ccclass, property } = _decorator;

@ccclass
export class ErrorMessageDirect extends ErrorMessage {
    @property(RandomWaitingMessage)
    cmpMessage: RandomWaitingMessage = null;

    setMessage(message: string) {
        if (this.cmpMessage) {
            this.cmpMessage.reset();
        }
        this.lblMessage.string = message;
    }
}
