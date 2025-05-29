export const find = jest.fn().mockImplementation(() => ({
    getComponent: jest.fn().mockReturnValue({
        namespace: "mockedNamespace",
    }),
}));
