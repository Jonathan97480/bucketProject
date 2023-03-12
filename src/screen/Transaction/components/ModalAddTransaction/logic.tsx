import { CategoryInterface } from "../../../../redux/categorySlice";
import { CompteInterface, MonthInterface, TransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase"


export interface FormAddBudget {
    name: string,
    montant: string,
    errorMontant: string,
    errorName: string,
    typeTransaction: 'Spent' | 'Budget',
    typeOperation: 'income' | 'expense',
    period: "day" | "week" | "month" | "year",
    categoryTransaction: number
    isUnique: boolean
}

export const getAllCategory = async () => {


    const _category: CategoryInterface[] = await DatabaseManager.GetAllCategory();

    return _category;



}


export function ResetForm(): FormAddBudget {
    return { name: '', montant: '', errorMontant: '', errorName: '', typeTransaction: 'Spent', typeOperation: 'expense', categoryTransaction: 0, isUnique: true, period: "day" };
}

export function ValidateForm(formAddBudget: FormAddBudget, setFormAddBudget: (value: FormAddBudget) => void) {
    let isValid = true;
    if (formAddBudget.name.length <= 0) {
        setFormAddBudget({ ...formAddBudget, errorName: 'le nom est obligatoire' });
        isValid = false;
    }
    if (formAddBudget.montant.length <= 0) {
        setFormAddBudget({ ...formAddBudget, errorMontant: 'le montant est obligatoire' });
        isValid = false;
    }
    return isValid;
}

export const createNewTransaction = (index: number, formAddBudget: FormAddBudget): TransactionMonthInterface => {


    return {
        id: index,
        name: formAddBudget.name,
        start_montant: parseFloat(formAddBudget.montant),
        montant: parseFloat(formAddBudget.montant),
        date: new Date().toDateString(),
        status: formAddBudget.isUnique ? 'unique' : 'recurring',
        typeOperation: formAddBudget.typeOperation,
        categoryID: formAddBudget.categoryTransaction,
        period: formAddBudget.isUnique ? null : formAddBudget.period,
        transactionType: formAddBudget.typeTransaction,
        transaction: formAddBudget.typeTransaction === "Spent" ? null : { income: [], expense: [] }

    }

}

export const saveTransaction = async (currentCompte: CompteInterface, currentMonth: MonthInterface) => {

    currentCompte.transactions.find((transactionsParYear: TransactionInterface, index) => {

        if (transactionsParYear.year === new Date().getFullYear()) {
            transactionsParYear.month.find((month: MonthInterface, _index) => {
                if (month.nameMonth === currentMonth.nameMonth) {

                    transactionsParYear = { ...transactionsParYear, month: [...transactionsParYear.month] }

                    transactionsParYear.month[_index] = currentMonth;
                    transactionsParYear.month[_index].numberTransactionMonth += 1;
                    transactionsParYear.numberTransactionYear += 1;
                    currentCompte = { ...currentCompte, transactions: [...currentCompte.transactions] }
                    currentCompte.transactions[index] = transactionsParYear;

                    const newResultCompte = calculTransactionByCompte(currentCompte, currentMonth);
                    currentCompte.pay = newResultCompte.pay;
                    currentCompte.withdrawal = newResultCompte.withdrawal;
                    currentCompte.deposit = newResultCompte.deposit;

                    DatabaseManager.UpdateCompte(
                        currentCompte.id,
                        currentCompte.name,
                        currentCompte.pay,
                        currentCompte.withdrawal,
                        currentCompte.deposit,
                        currentCompte.transactions
                    ).then((_compte) => {
                        currentCompte = _compte;
                        return true;
                    });



                }

            })
        }



    })

    return currentCompte;



}


export const calculTransactionByCompte = (compte: CompteInterface, currentMonth: MonthInterface): {
    pay: number,
    withdrawal: number,
    deposit: number
} => {

    let result = {
        pay: currentMonth.AccountBalanceBeginningMonth,
        withdrawal: 0,
        deposit: 0
    }

    currentMonth.transactions.income.forEach((transaction: TransactionMonthInterface) => {
        result.deposit += transaction.montant;
        result.pay += transaction.montant;
    })

    currentMonth.transactions.expense.forEach((transaction: TransactionMonthInterface) => {
        result.withdrawal += transaction.montant;
        result.pay -= transaction.montant;
    })


    return result;

}