import { _decorator, Label } from "cc";

const { ccclass, property } = _decorator;

@ccclass("ResultStatisticItemProperty")
export class ResultStatisticItemProperty {
    @property
    value = "";

    @property(Label)
    label: Label = null;
}
