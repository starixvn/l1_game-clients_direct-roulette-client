import { _decorator } from "cc";
import { FontMapping, LocalizedFont } from "./localized-font";

const { ccclass } = _decorator;

@ccclass("LocalizedFontBold")
export default class LocalizedFontBold extends LocalizedFont {
    initData() {
        const notoBold = "noto-serif-bold";
        this.fontBases = {
            vi: notoBold,
            id: notoBold,
            en: notoBold,
            th: "noto-serif-bold-thai",
            zh_cn: "noto-serif-bold-zhcn",
            zh_tw: "noto-serif-bold-zhtw",
        } as FontMapping;
    }
}
