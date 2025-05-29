import { CCBoolean, CCInteger, Layout, Prefab, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass("GridLayoutSettings")
export class GridLayoutSettings {
    @property({ type: Layout.AxisDirection })
    public direction = Layout.AxisDirection.HORIZONTAL;

    @property(CCBoolean)
    public scrollable = true;

    @property({
        visible: function (this: GridLayoutSettings) {
            return this.scrollable;
        },
    })
    public scrollToEnd = true;

    @property(CCInteger)
    public row = 1;

    @property(CCInteger)
    public column = 1;

    @property(CCInteger)
    public itemSize = 0;

    @property(Prefab)
    public itemPrefab: Prefab = null;
}
