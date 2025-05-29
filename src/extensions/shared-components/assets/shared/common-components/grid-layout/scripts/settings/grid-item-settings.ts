import { CCInteger, Prefab, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass("GridItemSettings")
export class GridItemSettings {
    @property(CCInteger)
    public size = 0;

    @property(Prefab)
    public prefab: Prefab = null;
}
