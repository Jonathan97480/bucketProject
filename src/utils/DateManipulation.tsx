
/**
 *  renvoie le mois en français a partir de son numéro
 * @param month numéro du mois
 * @returns string
 * @example getMonthByNumber(1) => "Janvier"
 * @example getMonthByNumber(2) => "Février"
 * @example getMonthByNumber(3) => "Mars"
 * @example getMonthByNumber(13) => "Erreur"
 */
export const getMonthByNumber = (month: number): string => {

    switch (month) {
        case 1:
            return "Janvier";
        case 2:
            return "Février";
        case 3:
            return "Mars";
        case 4:
            return "Avril";
        case 5:
            return "Mai";
        case 6:
            return "Juin";
        case 7:
            return "Juillet";
        case 8:
            return "Août";
        case 9:
            return "Septembre";
        case 10:
            return "Octobre";
        case 11:
            return "Novembre";
        case 12:
            return "Décembre";
        default:
            return "Erreur";
    }


}

/**
 * renvoie la date courante en string
 * @returns string
 * @example getDate() => "2021-01-01"
 */
export const getDate = (): string => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/**
 * renvoie la date courante en full string
 * @returns string
 * @example getDateFull() => "2021 Janvier 01"
*/
export const getDateFull = (): string => {
    const date = new Date();
    return `${date.getFullYear()} ${getMonthByNumber(date.getMonth() + 1)} ${date.getDate()}`;
}

/**
 * renvoie la date courante en full string dans l'ordre français
 * @returns string
 * @example getDateFull() => "01 Janvier 2021"
*/
export const getDateFullFR = (): string => {
    const date = new Date();
    return `${date.getDate()} ${getMonthByNumber(date.getMonth() + 1)} ${date.getFullYear()}`;
}

/**
 * renvoie les jours de la semaine en français a partir de leur numéro
    * @param dayOfWeek numéro du jour de la semaine
    * @returns string
    * @example getDayOfWeek(1) => "Lundi"
    * @example getDayOfWeek(2) => "Mardi"
    * @example getDayOfWeek(3) => "Mercredi"
    * @example getDayOfWeek(4) => "Jeudi"
    * @example getDayOfWeek(5) => "Vendredi"
    * @example getDayOfWeek(6) => "Samedi"
    * @example getDayOfWeek(7) => "Dimanche"
    * @example getDayOfWeek(8) => "Erreur"
 */
export const getDayOfWeek = (dayOfWeek: number): string => {
    switch (dayOfWeek) {
        case 1:
            return "Lundi";
        case 2:
            return "Mardi";
        case 3:
            return "Mercredi";
        case 4:
            return "Jeudi";
        case 5:
            return "Vendredi";
        case 6:
            return "Samedi";
        case 7:
            return "Dimanche";
        default:
            return "Erreur";
    }
}



