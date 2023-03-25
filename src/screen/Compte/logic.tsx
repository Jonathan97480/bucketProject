import { CompteInterface, MonthInterface, TransactionInterface } from "../../redux/comptesSlice";
import { getMonthByNumber } from "../../utils/DateManipulation";

export const FixeIsYearAndMonthExist = (currentCompte: CompteInterface) => {

    let newCompte = JSON.parse(JSON.stringify(currentCompte));


    let indexYear = currentCompte.transactions.findIndex((transaction) => {
        return transaction.year === new Date().getFullYear();
    })


    if (indexYear === -1) {
        const newYear = fixeYear(newCompte)
        newCompte = newYear.compte
        indexYear = newYear.index
    }

    return fixeMonth(currentCompte, indexYear)


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

    let curentYearTransaction = { ...currentCompte.transactions[index] };

    let curentMonthTransaction = {

        ...curentYearTransaction.month.filter((transaction) => {

            return transaction.nameMonth === curentNameMonth;

        })

    }

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

        NewMonthTransaction = injectRecurringOperationNewMonth(NewMonthTransaction, curentYearTransaction);
        currentCompte.pay = NewMonthTransaction.AccountBalanceBeginningMonth

        curentYearTransaction.month.push(NewMonthTransaction)

        currentCompte.transactions[index] = curentYearTransaction
        return currentCompte

    }

    return null

}


function injectRecurringOperationNewMonth(NewMonthTransaction: MonthInterface, curentYearTransaction: TransactionInterface) {

    NewMonthTransaction.transactions.expense = curentYearTransaction.operationRecurring.expense;
    NewMonthTransaction.transactions.income = curentYearTransaction.operationRecurring.income;
    NewMonthTransaction.numberTransactionMonth = curentYearTransaction.operationRecurring.expense.length + curentYearTransaction.operationRecurring.income.length;

    const total = {
        income: 0,
        expense: 0
    }

    curentYearTransaction.operationRecurring.expense.forEach((expense) => {
        total.expense += expense.montant_real != 0 ? expense.montant_real : expense.montant;

    })

    curentYearTransaction.operationRecurring.income.forEach((income) => {
        total.income += income.montant_real != 0 ? income.montant_real : income.montant;
    })

    NewMonthTransaction.AccountBalanceBeginningMonth += (total.income - total.expense);

    return NewMonthTransaction;


}