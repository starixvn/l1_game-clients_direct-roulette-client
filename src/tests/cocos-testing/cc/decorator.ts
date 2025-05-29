export const _decorator = {
    ccclass: (target?: any) => {
        if (typeof target === "string") {
            return (x: unknown) => x;
        }

        return target;
    },
    property: function (...args: any[]): any {
        if (arguments.length !== 3) {
            return jest.fn() as any;
        }
    },
    requireComponent: jest.fn().mockReturnValue(jest.fn()),
    executeInEditMode: () => jest.fn(),
    menu: () => jest.fn(),
    disallowMultiple: () => jest.fn(),
};
