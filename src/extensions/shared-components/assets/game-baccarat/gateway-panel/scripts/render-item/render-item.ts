import { _decorator, Component } from "cc";
import { GameData } from "../models/game-data";
const { ccclass, property } = _decorator;

@ccclass
export default class RenderItem extends Component {
    protected _gameData: GameData = null;
    init(data: GameData) {
        this._gameData = data;
    }
    protected onData: (data: any) => void;
    clearRenderListeners() {}
    onDestroy() {
        this.clearRenderListeners();
    }
}
