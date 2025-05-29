import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
const { injectable } = inversify;

export type TEndBetInfo = {
    bet: number;
};

@injectable()
export class MainPlayerProfileStore {
    private _containerEffectNode: Node = null;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get containerEffectNode() {
        return this._containerEffectNode;
    }

    set containerEffectNode(ownerAvatar: Node) {
        this._containerEffectNode = ownerAvatar;
    }
}
