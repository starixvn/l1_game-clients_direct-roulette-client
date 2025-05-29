import { _decorator, log, Node, Toggle } from "cc";
import Observer from "observer";
import LocalizedLabelWithFormat from "../../../../../../i18n/assets/LocalizedLabelWithFormat";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { GatewayPanelStore } from "../gateway-panel-store";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
@ccclass("GoodRoadSetting")
export class GoodRoadSetting extends ObserverComponent {
    @property(Toggle)
    toggleAll: Toggle = null;

    @property(Node)
    patternToggleContainer: Node = null;

    patternToggles: Toggle[] = [];

    selectedFlag = {};

    private configToggles = [];

    onLoad() {
        this.patternToggles = this.patternToggleContainer.getComponentsInChildren(Toggle);

        super.onLoad();
    }

    @render(GatewayPanelStore, (store) => store.config)
    renderConfig(config) {
        this.configToggles = config;

        try {
            this.patternToggles.forEach((toggle, index) => {
                const key = this.configToggles[index].key;
                toggle.node.name = key;
                const label = toggle.node.getComponentInChildren(LocalizedLabelWithFormat);
                label.key = `BaccaratX.${key}`;
            });
        } catch (e) {
            log(e);
        }
    }

    onToggleAll(toggle: Toggle) {
        const activeAll = toggle.isChecked;
        this.patternToggles.forEach((toggle) => (toggle.isChecked = activeAll));
    }

    onSinglePatternToggle(toggle: Toggle) {
        this.updateSelectedPatterns(toggle.node.name, toggle.isChecked);
    }

    @render(GatewayPanelStore, (store) => store.selectedPatternFlag)
    renderPatterns(selectedFlag) {
        this.selectedFlag = selectedFlag;

        this.updateCheckedToggles();
    }

    updateCheckedToggles() {
        let isAllCheck = true;
        this.patternToggles.forEach((toggle) => {
            const isCheck = this.selectedFlag[toggle.node.name];
            toggle.setIsCheckedWithoutNotify(isCheck);

            if (!isCheck) {
                isAllCheck = false;
            }
        });

        this.toggleAll.setIsCheckedWithoutNotify(isAllCheck);
    }

    @handle(GatewayPanelStore, (store, selectedFlag: { [key: string]: boolean }) => store.onChangePatterns(selectedFlag))
    updateSelectedPatterns(key: string, checked: boolean) {
        if (!checked) {
            this.toggleAll.setIsCheckedWithoutNotify(false);
        }
        this.selectedFlag[key] = checked;
        return this.selectedFlag;
    }
}
