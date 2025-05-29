export class Asset {}

export namespace AssetManager {
    export class Bundle {
        load = jest.fn();
    }
}

export const assetManager = {
    loadBundle: jest.fn(),
    loadRemote: jest.fn(),
};

export const log = jest.fn();
export const warn = jest.fn();
export const error = jest.fn();
