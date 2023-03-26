import { CompteInterface, MonthInterface, TransactionMonthInterface } from "../../redux/comptesSlice";
import DatabaseManager from "../../utils/DataBase";

interface Props {
    budget: TransactionMonthInterface,
    compte: CompteInterface,
    month: MonthInterface
}

export async function CLoseBudget({ budget, compte, month }: Props) {

    let newBudget: TransactionMonthInterface = JSON.parse(JSON.stringify(budget));
    let newCompte: CompteInterface = JSON.parse(JSON.stringify(compte));
    let newCurentMonth: MonthInterface = JSON.parse(JSON.stringify(month));



    newBudget.isClosed = true;
    if (newBudget.typeOperation === "expense") {
        newCompte.withdrawal -= newBudget.start_montant;
        newCompte.withdrawal += (newBudget.start_montant - newBudget.montant);
    }
    if (newBudget.typeOperation === "income") {
        newCompte.deposit -= newBudget.start_montant;
        newCompte.deposit += (newBudget.start_montant - newBudget.montant);
    }


    newCompte.pay = newCompte.deposit - newCompte.withdrawal;
    newBudget.start_montant -= newBudget.montant;
    newBudget.montant = 0;



    const indexBudgetInTheMonth = newCurentMonth.transactions[budget.typeOperation].findIndex((item) => item.id === newBudget.id);

    if (indexBudgetInTheMonth === -1) throw new Error("Une erreur est survenue lors de la fermeture du budget: Budget introuvable");

    newCurentMonth.transactions[newBudget.typeOperation][indexBudgetInTheMonth] = newBudget;

    const indexYear = newCompte.transactions.findIndex((item) => item.year === new Date().getFullYear());
    if (indexYear === -1) throw new Error("Une erreur est survenue lors de la fermeture du budget: Année introuvable");

    const indexMonth = newCompte.transactions[indexYear].month.findIndex((item) => item.nameMonth === newCurentMonth.nameMonth);
    if (indexMonth === -1) throw new Error("Une erreur est survenue lors de la fermeture du budget: Mois introuvable");

    newCompte.transactions[indexYear].month[indexMonth] = newCurentMonth;

    console.log("newCompte", newCompte);


    const result = await DatabaseManager.UpdateCompte(
        newCompte.id,
        newCompte.name,
        newCompte.pay,
        newCompte.withdrawal,
        newCompte.deposit,
        newCompte.transactions

    );

    console.log("result", result);


    if (!result) throw new Error("Une erreur est survenue lors de la fermeture du budget: Mise à jour du compte impossible");

    return {

        budget: newBudget,
        compte: result,
        month: newCurentMonth
    }


}