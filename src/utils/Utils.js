export default class Utils {

    static getNumberFromString(string) {
        return Number.parseInt(string.replace(/^\D+/g, ''));
    }

}