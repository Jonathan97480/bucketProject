import { MonthInterface, TransactionInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase";
import { getMonthByNumber } from "../../../../utils/DateManipulation";

export const createCompte = async ({ _idUser, _nameCompte }: {
    _idUser: number,
    _nameCompte: string,
}) => {

    const newCompte = await DatabaseManager.CreateCompte({
        _idUser,
        _name: _nameCompte,
        _discovered: false,
        _discoveredMontant: 0,
    });

    if (newCompte) {

        newCompte.transactions = [];

        newCompte.transactions.push(generatedTransactionDefault({

            _AccountBalanceBeginningMonth: newCompte.pay

        }));

        newCompte.withdrawal = 0;
        newCompte.deposit = 0;
        newCompte.pay = 0;

        const compteUpdate = await DatabaseManager.UpdateCompte(
            newCompte.id,
            newCompte.name,
            newCompte.pay,
            newCompte.withdrawal,
            newCompte.deposit,
            newCompte.transactions
        );

        return compteUpdate;

    } else {
        throw new Error("erreur lors de la création du compte");
    }

}


function generatedTransactionDefault({ _AccountBalanceBeginningMonth = 0 }: {

    _AccountBalanceBeginningMonth?: number,

}) {

    const curentDate = new Date();

    const monthName = getMonthByNumber(curentDate.getMonth() + 1);

    const transaction: TransactionInterface = {
        operationRecurring: {
            income: [],
            expense: []
        },
        year: curentDate.getFullYear(),
        numberTransactionYear: 0,
        month: [{
            nameMonth: monthName,
            numberTransactionMonth: 0,
            AccountBalanceBeginningMonth: _AccountBalanceBeginningMonth,
            transactions: {
                income: [],
                expense: []
            }
        }]
    }

    return transaction;

}