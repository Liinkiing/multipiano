export default class Utils {

    static getNumberFromString(string) {
        return Number.parseInt(string.replace(/^\D+/g, ''));
    }

    static replaceNumberFromString(string, number) {
        return string.replace(/[0-9]/g, number)
    }

    static clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }


}
