import { _decorator, Component } from "cc";

const { ccclass } = _decorator;

@ccclass
export class IdentifierTesting extends Component {
    onClick() {
        console.log("Clicked");
    }
}
