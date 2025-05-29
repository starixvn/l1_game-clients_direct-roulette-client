import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import { ObserverComponent } from "../observer-component/scripts/observer-component";

const { StorageManager, localStorageKeys } = gc;
const { ccclass, property } = _decorator;

@ccclass("SystemDecoratorLabel")
export class SystemDecoratorLabel extends ObserverComponent {
    @property(Node)
    bgNode: Node = null;

    label: Label = null;

    private readonly OPERATOR_NAMES = {
        SG: "SABA.games",
        VG: "Vgaming",
        SP: "SABA Play",
        TIP88: "",
    } as const;

    onLoad(): void {
        this.label = this.getComponent(Label);
        super.onLoad();
        this.renderOperatorName();
    }

    renderOperatorName() {
        const operatorKey = StorageManager.get(localStorageKeys?.operator)?.toString().toUpperCase();
        const operatorName = this.OPERATOR_NAMES[operatorKey] || "";

        if (this.label) {
            this.label.string = operatorName;
        }

        if (this.bgNode) {
            this.bgNode.active = !!operatorName;
        }
    }
}
