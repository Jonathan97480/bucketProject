import { addExpend, ExpendState, listeExpendInterface, PoleExpend } from "../redux/expendSlice";
import DatabaseManager from "./DataBase";


export async function ItemAddExpendSlice(Expend: listeExpendInterface, indexBudget: number, AllBudget: PoleExpend[]): Promise<PoleExpend[]> {

    return new Promise((resolve, reject) => {



        let newBudgets = [...AllBudget];
        let budgetCurent = { ...newBudgets[indexBudget] };

        /* get id is present */
        const id = Expend.id;
        if (budgetCurent.listeExpend.find((item) => item.id === id) !== undefined) {

            const index = budgetCurent.listeExpend.findIndex((item) => item.id === id);
            const listExpend = [...budgetCurent.listeExpend];
            listExpend[index] = Expend;

            budgetCurent.listeExpend = [...listExpend];

        } else {
            budgetCurent.listeExpend = [...budgetCurent.listeExpend, Expend];

        }

        newBudgets[indexBudget] = budgetCurent;


        const newBudgetMontant = CalculateNewBudgetMontant(newBudgets, indexBudget, Expend.montant, Expend.type);


        DatabaseManager.updateBudgetMontant(budgetCurent.id, newBudgetMontant).then(() => {

            newBudgets[indexBudget].montant = newBudgetMontant;

            resolve(newBudgets);

        }).catch((error) => {

            console.log(error);
            reject(error);

        });

    });


};

export function ItemDeleteExpendSlice(indexBudget: number, idExpend: number, AllBudget: PoleExpend[]): Promise<PoleExpend[]> {

    return new Promise((resolve, reject) => {



        let newBudgets = [...AllBudget];
        let budgetCurent = { ...newBudgets[indexBudget] };
        budgetCurent.listeExpend = [...budgetCurent.listeExpend];
        const curentExpends = budgetCurent.listeExpend.find((item) => item.id === idExpend);
        budgetCurent.listeExpend = budgetCurent.listeExpend.filter((item) => item.id !== idExpend);



        if (curentExpends !== undefined) {

            const newBudgetMontant = CalculateNewBudgetMontant(newBudgets, indexBudget, curentExpends.montant_total, curentExpends.type, true);

            newBudgets[indexBudget] = budgetCurent;

            DatabaseManager.updateBudgetMontant(budgetCurent.id, newBudgetMontant).then(() => {

                newBudgets[indexBudget].montant = newBudgetMontant;


                resolve(newBudgets);
            }).catch((error) => {

                console.log(error);
                reject(error);
            });



        } else {
            console.error("curentExpends not found");
        }

    });
}



export function fixedFloatNumber(number: number): number {
    return parseFloat(number.toFixed(2));
}

function CalculateNewBudgetMontant(newBudgets: PoleExpend[], indexBudget: number, montant: number, typeOperation: string, inverseCalcul?: boolean): number {

    let newBudgetMontant = newBudgets[indexBudget].montant;

    if (inverseCalcul && inverseCalcul === true) {
        typeOperation = typeOperation === "add" ? "withdrawal" : "add";
    }

    if (typeOperation === "add") {
        newBudgetMontant = newBudgetMontant + montant;
    } else {
        newBudgetMontant = newBudgetMontant - montant;
    }

    return fixedFloatNumber(newBudgetMontant);
}