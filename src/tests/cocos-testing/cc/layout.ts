import { Component } from "./component";

export enum AxisDirection {
    HORIZONTAL,
    VERTICAL,
}

export enum LayoutType {
    GRID,
}

export enum ResizeMode {
    CONTAINER,
}

export class Layout extends Component {
    static AxisDirection = AxisDirection;
    static Type = LayoutType;
    static ResizeMode = ResizeMode;

    updateLayout = jest.fn();

    startAxis: AxisDirection;

    type: LayoutType;

    resizeMode: ResizeMode;
}
