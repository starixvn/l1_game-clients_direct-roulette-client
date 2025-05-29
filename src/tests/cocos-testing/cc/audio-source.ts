import { AudioClip } from "./audio-clip";
import { Component } from "./component";

export enum EventType {
    STARTED = "started",
    ENDED = "ended",
}

export enum AudioState {
    INIT = 0,
    PLAYING = 1,
    PAUSED = 2,
    STOPPED = 3,
    INTERRUPTED = 4,
}

export class AudioSource extends Component {
    static AudioState = {
        INIT: 0,
        PLAYING: 1,
        PAUSED: 2,
        STOPPED: 3,
        INTERRUPTED: 4,
    };
    static EventType = {
        STARTED: "started",
        ENDED: "ended",
    };
    
    clip: AudioClip = null;
    loop = false;
    volume = 1;

    play = jest.fn();

    stop = jest.fn();

    playOneShot = jest.fn();
}
