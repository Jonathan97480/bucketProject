import { listeExpendInterface, PoleExpend } from "../redux/expendSlice";

export function textSizeFixe(text: string, size: number) {
    if (text.length > size) {
        return text.slice(0, size) + "...";
    }
    return text;
}

export function TextArrayAlphabetizeOrder(a: []) {
    return a.sort(function (x: string, y: string) {
        return x.toString().localeCompare(y.toString());
    });
}
export function ExpendArrayAlphabetizeOrder(a: listeExpendInterface[]) {
    return a.sort(function (x: listeExpendInterface, y: listeExpendInterface,) {
        return x.name.toLowerCase().localeCompare(y.name.toLowerCase(), "fr", { sensitivity: "base", ignorePunctuation: true, });
    },);



}

export function CreateDateCurentString(): string {
    const date = new Date();
    const date_string = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    return date_string;
}
