import { addExpend, ExpendState, listeExpendInterface, PoleExpend } from "../redux/expendSlice";
import DatabaseManager from "./DataBase";


export async function ItemAddExpendSlice(Expend: listeExpendInterface, indexBudget: number, AllBudget: PoleExpend[]): Promise<PoleExpend[]> {

    return new Promise((resolve, reject) => {



        let newBudgets = [...AllBudget];
        let budgetCurent = { ...newBudgets[indexBudget] };
        budgetCurent.listeExpend = [...budgetCurent.listeExpend, Expend];

        newBudgets[indexBudget] = budgetCurent;


        const newBudgetMontant = Expend.type === "add" ? budgetCurent.montant + Expend.montant : budgetCurent.montant - Expend.montant;

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

            const newBudgetMontant = curentExpends.type === "add" ? budgetCurent.montant - curentExpends.montant : budgetCurent.montant + curentExpends.montant;

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