import gc from "@sg/game-client-base";
import inversify from "inversify";

const { injectable } = inversify;

@injectable()
export class FakeChipHandlers extends gc.Chips.ChipHandlers {
    eventHandleList = [
        {
            name: gc.GameServiceMessage.PlayerChip.eventName,
            handle: this.handlePlayerChip,
        },
        {
            name: gc.GameServiceMessage.OwnChip.eventName,
            handle: this.handleOwnChip,
        },
        {
            name: gc.GameServiceMessage.ReBet.eventName,
            handle: this.handleReBet,
        },
    ];
}
