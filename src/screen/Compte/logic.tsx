import { CompteInterface, MonthInterface } from "../../redux/comptesSlice";
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

    const curentNameMonth: string = getMonthByNumber(new Date().getMonth() + 1);

    let curentYearTransaction = { ...currentCompte.transactions[index] };

    let curentMonthTransaction = {

        ...curentYearTransaction.month.filter((transaction) => {

            return transaction.nameMonth === curentNameMonth;

        })

    }

    if (Object.keys(curentMonthTransaction).length === 0) {

        const NewMonthTransaction: MonthInterface = {

            nameMonth: curentNameMonth,
            transactions: {
                income: [],
                expense: []
            },
            AccountBalanceBeginningMonth: currentCompte.pay,
            numberTransactionMonth: 0

        }

        curentYearTransaction.month = [...curentYearTransaction.month]
        curentYearTransaction.month.push(NewMonthTransaction)

        const newCurent = { ...currentCompte };
        newCurent.transactions = [...currentCompte.transactions]

        newCurent.transactions[index] = curentYearTransaction

        return newCurent

    }

    return null

}