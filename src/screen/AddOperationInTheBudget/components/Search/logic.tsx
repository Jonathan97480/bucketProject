import { SimpleTransactionInterface } from "../../../../redux/comptesSlice";

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

export function OperationArrayAlphabetizeOrder(a: SimpleTransactionInterface[]) {
    return a.sort(function (x: SimpleTransactionInterface, y: SimpleTransactionInterface,) {

        return x.name.toLowerCase().localeCompare(y.name.toLowerCase(), "fr", { sensitivity: "base", ignorePunctuation: true, });
    },);



}