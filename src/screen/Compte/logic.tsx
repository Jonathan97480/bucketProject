import { CompteInterface } from "../../redux/comptesSlice";
import { getMonthByNumber } from "../../utils/DateManipulation";

export const FixeIsYearAndMonthExist = (currentCompte: CompteInterface) => {

    let index = currentCompte.transactions.findIndex((transaction) => {
        return transaction.year === new Date().getFullYear();
    })


    if (index === -1) {
        const newYear = fixeYear(currentCompte)
        currentCompte = newYear.newCurent
        index = newYear.index
    }

    return fixeMonth(currentCompte, index)


}


const fixeYear = (currentCompte: CompteInterface) => {

    const curentYearTransaction = {

        year: new Date().getFullYear(),
        month: [],
        numberTransactionYear: 0

    }

    const newCurent = { ...currentCompte };
    newCurent.transactions = [...currentCompte.transactions]
    newCurent.transactions.push(curentYearTransaction)



    return { newCurent, index: newCurent.transactions.length - 1 }

}


const fixeMonth = (currentCompte: CompteInterface, index: number): CompteInterface | null => {

    let curentYearTransaction = { ...currentCompte.transactions[index] };

    const curentMonthTransaction = {

        ...curentYearTransaction.month.filter((transaction) => {

            return transaction.nameMonth === getMonthByNumber(new Date().getMonth() + 1);

        })

    }
    console.log("Curent Month", curentMonthTransaction, new Date().getMonth() + 1)
    if (Object.keys(curentMonthTransaction).length === 0) {

        curentMonthTransaction[0] = {

            nameMonth: getMonthByNumber(new Date().getMonth() + 1),
            transactions: [],
            numberTransactionMonth: 0

        }

        curentYearTransaction.month = [...curentYearTransaction.month]
        curentYearTransaction.month.push(curentMonthTransaction[0])

        const newCurent = { ...currentCompte };
        newCurent.transactions = [...currentCompte.transactions]

        newCurent.transactions[index] = curentYearTransaction
        console.log("New CUrent", newCurent)
        return newCurent

    }

    return null

}