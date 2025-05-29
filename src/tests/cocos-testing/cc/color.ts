export class Color {
    static RED: Color = new Color();

    static WHITE: Color = new Color();

    static YELLOW: Color = new Color();

    static fromHEX = (...args: any[]) => new Color();

    fromHEX(hexColor: string) {
        const color = new Color();
        color.hexValue = hexColor;
        return color;
    }

    hexValue = "";

    _color: Color;

    constructor(...args: any[]) {}
}
