import { _decorator, Color, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class ClientSeedInfo extends Component {
    @property(Label)
    lblName: Label = null;

    @property(Label)
    lblClientSeed: Label = null;

    @property(Node)
    nodeDisabledBg: Node = null;

    setDisplay(data: any) {
        this.lblName.node.active = true;
        this.lblName.string = this.encryptedName(data.name);
        this.lblClientSeed.string = data.clientSeed;
    }

    activeDisabledBg(show: boolean) {
        this.nodeDisabledBg.active = show;
    }

    private encryptedName(name: string): string {
        return `(${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)})`;
    }

    setDisplayName(data: any, encryptedName: boolean) {
        this.lblName.node.active = true;
        this.lblName.string = encryptedName ? this.encryptedName(data.name) : data.name;
        this.lblName.color = encryptedName ? new Color("#bdbec9") : Color.GREEN;
        this.lblClientSeed.string = data.clientSeed;
    }
}
