export const colorList = {
    good: '#59ab60',
    bad: '#d15b4b',
    normal: '#596cab',
    primary: '#fff',
}
export function getColorBudget(montant: number, start_montant: number) {
    if (montant > start_montant) {
        return colorList.good;
    } else if (montant <= start_montant / 10 && montant > (start_montant * 40) / 100 || montant === start_montant) {
        return colorList.normal;
    } else {
        return colorList.bad;
    }
}