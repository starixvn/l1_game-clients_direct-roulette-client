import { Component } from "./component";

export class EditBox extends Component {
    focus = jest.fn();
    private _string = "";

    get string(): string {
        return this._string;
    }

    set string(value: string) {
        this._string = value || "";
    }
}
