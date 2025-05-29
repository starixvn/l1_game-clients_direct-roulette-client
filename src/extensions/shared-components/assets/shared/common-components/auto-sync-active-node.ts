import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class AutoSyncActiveNode extends Component {
    @property(Node)
    target: Node = null;

    private intervalSync: NodeJS.Timer;

    onLoad() {
        this.intervalSync = setInterval(() => this.syncActive(), 1000 / 60);
    }
    onDestroy() {
        this.intervalSync && clearInterval(this.intervalSync);
    }

    syncActive() {
        this.node.active = this.target.activeInHierarchy;
    }
}
