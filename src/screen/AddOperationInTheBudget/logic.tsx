import { SimpleTransactionInterface } from "../../redux/comptesSlice";
import { OperationArrayAlphabetizeOrder } from "../../utils/TextManipulation";

export function rechercheExpendByName({ income, expense, recherche }: {
    income: SimpleTransactionInterface[]
    expense: SimpleTransactionInterface[]
    recherche: string
}) {


    let newIncome = income.filter((item) => {

        return item.name.toLowerCase().includes(recherche.toLowerCase());

    });

    newIncome = OperationArrayAlphabetizeOrder(newIncome);


    let newExpense = expense.filter((item) => {
        return item.name.toLowerCase().includes(recherche.toLowerCase());
    });

    newExpense = OperationArrayAlphabetizeOrder(newExpense);

    return {
        income: newIncome,
        expense: newExpense
    };

}

