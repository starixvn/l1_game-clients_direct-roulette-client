export default class RouletteUtils {
    private static readonly redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

    public static isRed(number): boolean {
        return this.redNumbers.indexOf(number) !== -1;
    }
}
