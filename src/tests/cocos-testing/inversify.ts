export const injectable = jest.fn().mockImplementation(() => () => {});

export const inject = jest.fn().mockImplementation(() => () => {});

export default { injectable, inject };
