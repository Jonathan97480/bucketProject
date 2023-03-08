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


        const newAllBudget = CalculateNewBudgetMontant(newBudgets, indexBudget);


        DatabaseManager.updateBudgetMontant(budgetCurent.id, newAllBudget[indexBudget].montant).then(() => {


            resolve(newAllBudget);

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

            const curentListExpends = newBudgets[indexBudget].listeExpend.filter((item) => item.id !== idExpend);


            budgetCurent.listeExpend = [...curentListExpends];
            newBudgets[indexBudget] = { ...budgetCurent };

            console.log("newBudgets FILTER ", newBudgets);

            const newBudgetAllBudget = CalculateNewBudgetMontant(newBudgets, indexBudget);


            DatabaseManager.updateBudgetMontant(budgetCurent.id, newBudgetAllBudget[indexBudget].montant).then(() => {

                DatabaseManager.deleteExpend(idExpend).then(() => {

                    console.log("delete expend success");
                    resolve(newBudgetAllBudget);

                }).catch((error) => {

                    console.log(error);
                });

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

function CalculateNewBudgetMontant(newBudgets: PoleExpend[], indexBudget: number): PoleExpend[] {

    const CurentBudget = newBudgets[indexBudget];
    const newAllBudgets = [...newBudgets];


    CurentBudget.montant = CurentBudget.montantStart;

    CurentBudget.listeExpend.forEach((expend) => {
        switch (expend.type) {
            case "add":
                CurentBudget.montant += expend.montant_total;
                break;

            default:
                CurentBudget.montant -= expend.montant_total;
                break;
        }

    });
    CurentBudget.montant = fixedFloatNumber(CurentBudget.montant);
    newAllBudgets[indexBudget] = CurentBudget;

    return newAllBudgets;
}