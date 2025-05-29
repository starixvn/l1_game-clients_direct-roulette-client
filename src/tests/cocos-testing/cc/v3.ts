export const v3 = jest.fn();

export class Vec3 {
    static ZERO = 0;
    static ONE = 1;

    x? = 0;
    y? = 0;
    z? = 0;

    clone = jest.fn();
}
