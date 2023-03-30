export const colorList = {
    good: '#59ab60',
    bad: '#d15b4b',
    normal: '#596cab',
    primary: '#fff',
}

/**
 *  renvoie la couleur du Budget en fonction du montant restant et du montant de départ
 * @param montant 
 * @param start_montant 
 * @returns  string
 * @example getColorBudget(100, 100) => "#59ab60"
 * @example getColorBudget(50, 100) => "#596cab"
 * @example getColorBudget(10, 100) => "#d15b4b"
 * @example getColorBudget(0, 100) => "#d15b4b"
 */
export function getColorBudget(montant: number, start_montant: number) {
    switch (true) {
        case montant === start_montant || montant > start_montant:
            return colorList.good;
        case montant < start_montant && montant > 0:
            return colorList.normal;
        case montant === 0:
            return colorList.bad;
        default:
            return colorList.bad;
    }


}

