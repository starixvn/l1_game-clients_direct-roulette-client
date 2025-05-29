import { Component } from "./component";
import { EventTouch } from "./event-touch";

export class Button extends Component {
    interactable = true;

    _onTouchBegan(event: EventTouch) {}

    _onTouchMove(event: EventTouch) {}
}
