import { ModuleMocker } from "jest-mock";

export const render = jest.fn().mockImplementation((ctor, callback) => () => {
    const mocker = new ModuleMocker(global);
    const Mock = mocker.generateFromMetadata(mocker.getMetadata(ctor));
    const instance = new Mock();

    callback(instance);
});

export const handle = (constructor, caller?) => jest.fn((constructor, caller, param) => {});
export const observer = (arg?: string) => {
    return arg || jest.fn();
};

export const useObserver =jest.fn();
export const configure = jest.fn();

export default { render, handle, configure, observer };
