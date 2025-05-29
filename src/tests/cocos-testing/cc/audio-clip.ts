import { Asset } from "./asset";

export class AudioClip extends Asset {
    duration = 0;

    getDuration = jest.fn();
    setCurrentTime = jest.fn();
    setVolume = jest.fn();
    setLoop = jest.fn();
    play = jest.fn();
    stop = jest.fn();
    playOneShot = jest.fn();
}
