import { getTrad } from "../lang/internationalization";
import { SimpleTransactionInterface } from "../redux/comptesSlice";
import { listeExpendInterface, PoleExpend } from "../redux/expendSlice";
import { listInterface, stepInterface } from "../redux/listSlice";


export function TextArrayAlphabetizeOrder(a: []) {
    return a.sort(function (x: string, y: string) {
        return x.toString().localeCompare(y.toString());
    });
}

/** 
 * renvoie un tableau de string trier par ordre alphabétique est insensible a la case 
 * @param a tableau de string
 * @returns tableau de string trier par ordre alphabétique
 * @example TextArrayAlphabetizeOrder(["test", "Test", "test1"]) => ["test", "test1", "Test"]
 * */
export function ListAlphabetizeOrder(a: stepInterface[]) {
    return a.sort(function (x, y) {
        return x.name.toLowerCase().localeCompare(y.name.toLowerCase(), "fr", { sensitivity: "base", ignorePunctuation: true, });
    },);
}


/**
 * vérifie si deux texte son identique nes pas sensible a la case et ho accent 
 * @param text1
 * @param text2
 * @returns boolean
 * @example TextCompare("test", "Test") => true
 * @example TextCompare("test", "Test1") => false
 *  */
export function TextCompare(text1: string, text2: string) {
    return text1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === text2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}




interface GenerateAlertInterface {
    type: any
    message: string,
}
/**
 * génère une ALert avec un message et un titre
 * @param title
 * @param message
 * @returns Alert
 * @example AlertMessage("test", "test") => Alert
 * */
export function generateAlert({ type, message, }: GenerateAlertInterface) {

    return {

        alert: message ? {
            type: getTrad(type),
            message: message,

        } : null

    };
}