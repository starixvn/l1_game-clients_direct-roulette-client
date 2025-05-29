import { _decorator, Component } from "cc";
import Observer from "observer";
import { FunctionUtils } from "../../../utils";

const { ccclass } = _decorator;
const { useObserver } = Observer;

@ccclass
export class ObserverComponent extends Component {
    private dispose: Function;

    onLoad(): void {
        this.dispose = useObserver(this, FunctionUtils.getNamespace());
    }

    onDestroy(): void {
        this.dispose && this.dispose();
    }
}
