export class Game {
    static EVENT_HIDE = "EVENT_HIDE";
    static EVENT_SHOW = "EVENT_SHOW";

    on = jest.fn();
    off = jest.fn();

    canvas: HTMLCanvasElement = null;
}

export const game = new Game();
