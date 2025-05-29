import hacks from "./hacks";

export class Input {
    static EventType = {
        TOUCH_START: "touch-start",

        TOUCH_MOVE: "touch-move",

        TOUCH_END: "touch-end",

        MOUSE_DOWN: "mouse-down",

        MOUSE_UP: "mouse-up",

        KEY_DOWN: "keydown",

        KEY_UP: "keyup",
    };

    on = jest.fn().mockReturnValue(hacks);

    off = jest.fn().mockReturnValue(hacks);
}

export const input = new Input();
