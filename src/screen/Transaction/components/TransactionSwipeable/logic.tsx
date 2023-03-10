import { CompteInterface, MonthInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase";
import { calculTransactionByCompte } from "../ModalAddTransaction/logic";

export const deleteTransaction = async ({ _transaction, _compte, _curentMonth }: {
    _transaction: TransactionMonthInterface
    _compte: CompteInterface,
    _curentMonth: MonthInterface
}) => {

    const curentCompte: CompteInterface = { ..._compte, transactions: [..._compte.transactions] };
    const curentMonth: MonthInterface = { ..._curentMonth, transactions: { ..._curentMonth.transactions } };

    if (_transaction.typeOperation === "income") {
        curentMonth.transactions.income = curentMonth.transactions.income.filter((transaction: TransactionMonthInterface) => {
            return transaction.id !== _transaction.id;
        })
    } else {
        curentMonth.transactions.expense = curentMonth.transactions.expense.filter((transaction: TransactionMonthInterface) => {
            return transaction.id !== _transaction.id;
        })
    }

    let indexYear = curentCompte.transactions.findIndex((year) => {
        return year.year === new Date().getFullYear();
    });

    let indexMonth = curentCompte.transactions[indexYear].month.findIndex((month) => {
        return month.nameMonth === curentMonth.nameMonth;
    });

    console.log("indexYear", indexYear, "indexMonth", indexMonth, "curentMonth", curentMonth);

    curentCompte.transactions = [...curentCompte.transactions];

    ;
    curentCompte.transactions[indexYear] = { ...curentCompte.transactions[indexYear], month: [...curentCompte.transactions[indexYear].month] };
    curentCompte.transactions[indexYear].month[indexMonth] = curentMonth;

    console.log("curentCompte", curentCompte);
    const newResultCompte = calculTransactionByCompte(curentCompte, curentMonth);

    curentCompte.pay = newResultCompte.pay;
    curentCompte.withdrawal = newResultCompte.withdrawal;
    curentCompte.deposit = newResultCompte.deposit;



    let result = await DatabaseManager.UpdateCompte(
        curentCompte.id,
        curentCompte.name,
        curentCompte.pay,
        curentCompte.withdrawal,
        curentCompte.deposit,
        curentCompte.transactions
    )



    return {

        compte: result,
        curentMonth: curentMonth
    };



}