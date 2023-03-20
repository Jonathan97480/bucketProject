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


    curentMonth.transactions[_transaction.typeOperation] = curentMonth.transactions[_transaction.typeOperation].filter((transaction: TransactionMonthInterface) => {
        return transaction.id !== _transaction.id;
    })



    let indexYear = curentCompte.transactions.findIndex((year) => {
        return year.year === new Date().getFullYear();
    });

    let indexMonth = curentCompte.transactions[indexYear].month.findIndex((month) => {
        return month.nameMonth === curentMonth.nameMonth;
    });



    curentCompte.transactions = [...curentCompte.transactions];


    curentCompte.transactions[indexYear] = { ...curentCompte.transactions[indexYear], month: [...curentCompte.transactions[indexYear].month] };

    /* delete recurring operation if existe */
    if (_transaction.status !== 'unique') {
        curentCompte.transactions[indexYear].operationRecurring = {
            ...curentCompte.transactions[indexYear].operationRecurring
        };
        curentCompte.transactions[indexYear].operationRecurring[_transaction.typeOperation] = [...curentCompte.transactions[indexYear].operationRecurring[_transaction.typeOperation]];

        curentCompte.transactions[indexYear].operationRecurring[_transaction.typeOperation] = curentCompte.transactions[indexYear].operationRecurring[_transaction.typeOperation].filter((transaction: TransactionMonthInterface) => {
            return transaction.name !== _transaction.name;
        });
    }


    curentCompte.transactions[indexYear].month[indexMonth] = curentMonth;

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