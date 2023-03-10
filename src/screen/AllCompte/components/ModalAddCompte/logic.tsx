import { TransactionInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase";
import { getMonthByNumber } from "../../../../utils/DateManipulation";

export const creteCompte = async ({ idUser, nameCompte }: {
    idUser: number,
    nameCompte: string,
}) => {

    const result = await DatabaseManager.CreateCompte({
        idUser,
        name: nameCompte
    });

    if (result) {

        result.transactions = [];
        result.transactions.push(generatedTransactionDefault());
        result.withdrawal = 0;
        result.deposit = 0;
        result.pay = 0;

        const resultUpdate = await DatabaseManager.UpdateCompte(
            result.id,
            result.name,
            result.pay,
            result.withdrawal,
            result.deposit,
            result.transactions
        );

        return resultUpdate;

    } else {
        throw new Error("erreur lors de la création du compte");
    }



}


function generatedTransactionDefault() {

    const curentDate = new Date();
    const monthName = getMonthByNumber(curentDate.getMonth() + 1);
    const transaction: TransactionInterface = {
        year: curentDate.getFullYear(),
        numberTransactionYear: 0,
        month: [{
            nameMonth: monthName,
            numberTransactionMonth: 0,
            transactions: []
        }]
    }
    return transaction;
}