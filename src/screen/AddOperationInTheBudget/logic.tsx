import { CompteInterface, MonthInterface, TransactionMonthInterface } from "../../redux/comptesSlice";
import DatabaseManager from "../../utils/DataBase";

interface Props {
    budget: TransactionMonthInterface,
    compte: CompteInterface,
    month: MonthInterface
}

export async function CloseBudget({ budget, compte, month }: Props) {

    let newBudget: TransactionMonthInterface = JSON.parse(JSON.stringify(budget));
    let newCompte: CompteInterface = JSON.parse(JSON.stringify(compte));
    let newCurentMonth: MonthInterface = JSON.parse(JSON.stringify(month));

    newBudget.isClosed = true;

    switch (newBudget.typeOperation) {
        case "expense":
            newCompte.withdrawal -= newBudget.start_montant;
            newCompte.withdrawal += (newBudget.start_montant - newBudget.montant);
            break;
        case "income":
            newCompte.deposit -= newBudget.start_montant;
            newCompte.deposit += (newBudget.start_montant - newBudget.montant);
            break;
        default:
            throw new Error("Une erreur est survenue lors de la fermeture du budget: Type d'opération introuvable");

    }


    /* calcul and fixe new value compte and budget */
    newCompte.pay = parseFloat((newCurentMonth.AccountBalanceBeginningMonth + (newCompte.deposit - newCompte.withdrawal)).toFixed(2));
    newBudget.start_montant -= parseFloat(newBudget.montant.toFixed(2));
    newBudget.montant = 0;


    const indexBudgetInTheMonth = newCurentMonth.transactions[budget.typeOperation].findIndex((item) => item.id === newBudget.id);

    if (indexBudgetInTheMonth === -1) throw new Error("Une erreur est survenue lors de la fermeture du budget: Budget introuvable");

    newCurentMonth.transactions[newBudget.typeOperation][indexBudgetInTheMonth] = newBudget;

    const indexYear = newCompte.transactions.findIndex((item) => item.year === new Date().getFullYear());
    if (indexYear === -1) throw new Error("Une erreur est survenue lors de la fermeture du budget: Année introuvable");

    const indexMonth = newCompte.transactions[indexYear].month.findIndex((item) => item.nameMonth === newCurentMonth.nameMonth);
    if (indexMonth === -1) throw new Error("Une erreur est survenue lors de la fermeture du budget: Mois introuvable");

    newCompte.transactions[indexYear].month[indexMonth] = newCurentMonth;



    const result = await DatabaseManager.UpdateCompte(
        newCompte.id,
        newCompte.name,
        newCompte.pay,
        newCompte.withdrawal,
        newCompte.deposit,
        newCompte.transactions

    );

    if (!result) throw new Error("Une erreur est survenue lors de la fermeture du budget: Mise à jour du compte impossible");

    return {

        budget: newBudget,
        compte: result,
        month: newCurentMonth
    }


}