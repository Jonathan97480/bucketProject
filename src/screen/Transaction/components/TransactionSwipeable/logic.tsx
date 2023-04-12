import { CompteInterface, MonthInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase";
import { getMonthByNumber } from "../../../../utils/DateManipulation";
import { calculTransactionByCompte } from "../ModalAddTransaction/logic";

export const deleteTransaction = async ({ _transaction, _compte, _curentMonth, _AllComptes }: {
    _transaction: TransactionMonthInterface
    _compte: CompteInterface,
    _curentMonth: MonthInterface
    _AllComptes: CompteInterface[]
}) => {

    const curentCompte: CompteInterface = JSON.parse(JSON.stringify(_compte));
    const curentMonth: MonthInterface = JSON.parse(JSON.stringify(_curentMonth));


    curentMonth.transactions[_transaction.typeOperation] = curentMonth.transactions[_transaction.typeOperation].filter((transaction: TransactionMonthInterface) => {
        return transaction.id !== _transaction.id;
    })

    curentMonth.numberTransactionMonth = curentMonth.numberTransactionMonth - 1;

    let indexYear = curentCompte.transactions.findIndex((year) => {
        return year.year === new Date().getFullYear();
    });

    let indexMonth = curentCompte.transactions[indexYear].month.findIndex((month) => {
        return month.nameMonth === curentMonth.nameMonth;
    });


    /* delete recurring operation if existe */
    if (_transaction.status !== 'unique') {

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

    if (result) {

        if (_transaction.transactionType === "BankTransfers") {

            const newAllComptes = await deleteTransfer(_transaction, _AllComptes);

            return {
                compte: result,
                curentMonth: curentMonth,
                allComptes: newAllComptes
            };

        }

        return {
            compte: result,
            curentMonth: curentMonth,
            allComptes: []
        };




    }

    return {
        compte: curentCompte,
        curentMonth: curentMonth,
        allComptes: []
    }
}


async function deleteTransfer(transaction: TransactionMonthInterface, _AllComptes: CompteInterface[]) {

    const newAllComptes: CompteInterface[] = JSON.parse(JSON.stringify(_AllComptes));

    let indexCompte = newAllComptes.findIndex((compte) => {
        return compte.id === transaction.idTransfer;
    });

    let indexYear = newAllComptes[indexCompte].transactions.findIndex((year) => {
        return year.year === new Date().getFullYear();
    });

    let indexMonth = newAllComptes[indexCompte].transactions[indexYear].month.findIndex((month) => {
        return month.nameMonth === getMonthByNumber(new Date().getMonth() + 1);
    });

    const month = newAllComptes[indexCompte].transactions[indexYear].month[indexMonth];


    month.transactions.income = month.transactions.income.filter((transactionMonth) => {
        return transactionMonth.name !== transaction.name;
    });

    newAllComptes[indexCompte].transactions[indexYear].month[indexMonth] = month;



    let newResultCompte = calculTransactionByCompte(newAllComptes[indexCompte], month);

    newAllComptes[indexCompte].pay = newResultCompte.pay;
    newAllComptes[indexCompte].withdrawal = newResultCompte.withdrawal;
    newAllComptes[indexCompte].deposit = newResultCompte.deposit;

    const result = await DatabaseManager.UpdateCompte(
        newAllComptes[indexCompte].id,
        newAllComptes[indexCompte].name,
        newAllComptes[indexCompte].pay,
        newAllComptes[indexCompte].withdrawal,
        newAllComptes[indexCompte].deposit,
        newAllComptes[indexCompte].transactions
    )


    if (result) {
        return newAllComptes;
    } else {
        throw new Error("Une erreur est survenue lors de la suppression de la transaction sur le compte de destination");
    }


}

export function getColorBackGroundCard(transactionType: "Spent" | "Budget" | "BankTransfers") {

    switch (transactionType) {
        case "Spent":
            return "#9C68DD";
        case "Budget":
            return "#4F94BB";
        case "BankTransfers":
            return "#DDA868";
        default:
            return "#9C68DD";
    }
}

export function getNameIconCard(transactionType: "Spent" | "Budget" | "BankTransfers", typeOperation: "income" | "expense") {

    switch (transactionType) {
        case "Spent":
            return typeOperation === "income" ? "coins" : "credit-card";
        case "Budget":
            return "money-bill-wave";
        case "BankTransfers":
            return "exchange-alt";
        default:
            return "shopping-cart";
    }
}