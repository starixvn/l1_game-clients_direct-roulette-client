import { _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass("ScoreboardConverterProperty")
export class ScoreboardConverterProperty {
    @property
    key = "";

    @property
    value = "";
}
