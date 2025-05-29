import { Component } from "./component";
import hacks from "./hacks";
import { Node } from "./node";

export class ScrollView extends Component {
    content?: Node = new Node();

    scrollToPercentHorizontal = jest.fn().mockReturnValue(hacks);

    getScrollOffset = jest.fn().mockReturnValue(hacks);

    getMaxScrollOffset = jest.fn().mockReturnValue(hacks);

    scrollToOffset = jest.fn().mockReturnValue(hacks);

    horizontal = false;
    vertical = false;
}
