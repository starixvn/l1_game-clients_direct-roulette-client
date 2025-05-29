export class Animation {
    play = jest.fn();
    on = jest.fn();
    off = jest.fn();
    clips = [];
    getState = jest.fn();
    static EventType = {
        PLAY: "play",
        STOP: "stop",
        PAUSE: "pause",
        RESUME: "resume",
        LASTFRAME: "lastframe",
        FINISHED: "finished",
    };
}
