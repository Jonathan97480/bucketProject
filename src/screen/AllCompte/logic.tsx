import { CompteInterface, MonthInterface, TransactionInterface } from "../../redux/comptesSlice";
import DatabaseManager from "../../utils/DataBase"
import { getMonthByNumber } from "../../utils/DateManipulation";

export const getCompteByUser = async (id: number) => {

    const AllComptes = await GetAllComptes(id);
    const result = await checkIsUpdateAllCompte(AllComptes);

    return result;


}

async function checkIsUpdateAllCompte(comptes: CompteInterface[]) {

    comptes.forEach(async (compte, index) => {

        const indexYear = compte.transactions.findIndex((transaction) => {
            return transaction.year === new Date().getFullYear();
        })

        if (indexYear === -1) {

            const newYear = fixeYear(compte);
            compte = newYear.compte;
            const newIndexYear = newYear.index;
            const newCompte = fixeMonth(compte, newIndexYear);

            if (newCompte === null) throw new Error("la fonction fixeMonth a retourné null");

            await UpdateCompte(newCompte);
            comptes[index] = newCompte;

        } else {

            const newCompte = fixeMonth(compte, indexYear)
            if (newCompte === null) return comptes;

            await UpdateCompte(newCompte);
            comptes[index] = newCompte;
        }
    });

    return comptes


}


const fixeYear = (currentCompte: CompteInterface) => {

    const curentYearTransaction: TransactionInterface = {

        year: new Date().getFullYear(),
        month: [],
        numberTransactionYear: 0,
        operationRecurring: {
            income: currentCompte.transactions[currentCompte.transactions.length - 1].operationRecurring.income,
            expense: currentCompte.transactions[currentCompte.transactions.length - 1].operationRecurring.expense
        },
    }

    currentCompte.transactions.push(curentYearTransaction)

    return {
        compte: currentCompte,
        index: currentCompte.transactions.length - 1
    }

}


const fixeMonth = (currentCompte: CompteInterface, index: number): CompteInterface | null => {

    const curentNameMonth: string = getMonthByNumber(new Date().getMonth() + 1);

    let curentYearTransaction = currentCompte.transactions[index];

    let curentMonthTransaction = curentYearTransaction.month.filter((transaction) => {

        return transaction.nameMonth === curentNameMonth;

    })



    if (Object.keys(curentMonthTransaction).length === 0) {

        let NewMonthTransaction: MonthInterface = {

            nameMonth: curentNameMonth,
            transactions: {
                income: [],
                expense: []
            },
            AccountBalanceBeginningMonth: currentCompte.pay,
            numberTransactionMonth: 0

        }

        curentYearTransaction.month.push(NewMonthTransaction);
        return currentCompte

    }

    return null

}


export async function UpdateCompte(compte: CompteInterface) {

    const result = await DatabaseManager.UpdateCompte(
        compte.id,
        compte.name,
        compte.pay,
        compte.withdrawal,
        compte.deposit,
        compte.transactions
    );

    return result

}


export async function GetAllComptes(id_user: number) {

    const arrayIDuserAndIDCompte = await DatabaseManager.GetIDComptesByIDUser(id_user)


    if (arrayIDuserAndIDCompte.length <= 0) return [] as CompteInterface[];

    const arrayIDCompte: number[] = [];

    arrayIDuserAndIDCompte.forEach((idUserAndIDCompte) => {

        arrayIDCompte.push(idUserAndIDCompte.compte_id);

    })

    const AllComptes = await DatabaseManager.GetAllComptesByListID(arrayIDCompte)

    return AllComptes;
}