import gc from "@sg/game-client-base";
import { _decorator, Component, Enum } from "cc";
import Observer from "observer";

export enum NodeType {
    Lobby = 0,
    Back = 1,
}

const { render, observer } = Observer;

const { App } = gc;

const { ccclass, property } = _decorator;
@ccclass
@observer
export default class DirectModeVisibility extends Component {
    @property({ type: Enum(NodeType) })
    type: NodeType = NodeType.Lobby;

    @render(App.AppStore, (store) => ({ isDirectMode: store.isDirectMode, returnUrl: store.urlInfo.returnUrl }))
    onVisibility({ isDirectMode, returnUrl }: { isDirectMode: boolean; returnUrl?: string }) {
        let visible = false;
        switch (this.type) {
            case NodeType.Lobby:
                visible = !isDirectMode || !!returnUrl;
                break;
            case NodeType.Back:
                visible = isDirectMode && !!returnUrl;
                break;
        }

        this.node.active = visible;
    }
}
