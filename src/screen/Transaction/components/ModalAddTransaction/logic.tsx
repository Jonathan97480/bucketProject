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
    return { name: '', montant: '', errorMontant: '', errorName: '', typeTransaction: 'Spent', typeOperation: 'expense', categoryTransaction: 1, isUnique: true, period: "day" };
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
        montant_real: 0,
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


export const UpdateTransaction = async ({ allTransaction, curentCompte, curentMonth, newTransaction }: { allTransaction: TransactionMonthInterface, curentCompte: CompteInterface, curentMonth: MonthInterface, newTransaction: FormAddBudget }) => {

    curentCompte = { ...curentCompte, transactions: [...curentCompte.transactions] }
    curentMonth = { ...curentMonth, transactions: { ...curentMonth.transactions } }
    if (newTransaction.typeOperation === 'income') {
        curentMonth.transactions.income = curentMonth.transactions.income.map((transaction: TransactionMonthInterface) => {

            if (transaction.id === allTransaction.id) {
                transaction = {
                    ...transaction,
                    montant: parseFloat(newTransaction.montant),
                    name: newTransaction.name,
                    start_montant: parseFloat(newTransaction.montant),
                    categoryID: newTransaction.categoryTransaction,
                    period: newTransaction.isUnique ? null : newTransaction.period,
                    status: newTransaction.isUnique ? 'unique' : 'recurring',
                    transactionType: newTransaction.typeTransaction,
                    typeOperation: newTransaction.typeOperation

                }
            }
            return transaction;

        })
    } else {




        curentMonth.transactions.expense = curentMonth.transactions.expense.map((transaction: TransactionMonthInterface) => {

            if (transaction.id === allTransaction.id) {
                transaction = {
                    ...transaction,
                    montant: parseFloat(newTransaction.montant),
                    start_montant: parseFloat(newTransaction.montant),
                    name: newTransaction.name,
                    categoryID: newTransaction.categoryTransaction,
                    period: newTransaction.isUnique ? null : newTransaction.period,
                    status: newTransaction.isUnique ? 'unique' : 'recurring',
                    transactionType: newTransaction.typeTransaction,
                    typeOperation: newTransaction.typeOperation

                }
            }
            return transaction;

        })

    }
    const newResultCompte = calculTransactionByCompte(curentCompte, curentMonth);
    curentCompte.pay = newResultCompte.pay;
    curentCompte.withdrawal = newResultCompte.withdrawal;
    curentCompte.deposit = newResultCompte.deposit;



    DatabaseManager.UpdateCompte(
        curentCompte.id,
        curentCompte.name,
        curentCompte.pay,
        curentCompte.withdrawal,
        curentCompte.deposit,
        curentCompte.transactions
    ).then((_compte) => {
        curentCompte = _compte;
        return true;
    });

    return {

        compte: curentCompte,
        curentMonth: curentMonth
    };


}


export const calculTransactionByCompte = (compte: CompteInterface, currentMonth: MonthInterface): {
    pay: number,
    withdrawal: number,
    deposit: number
} => {

    let result = {
        pay: currentMonth.AccountBalanceBeginningMonth == null ? 0 : currentMonth.AccountBalanceBeginningMonth,
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

export const defineFormAddBudget = (transaction: TransactionMonthInterface | undefined | null): FormAddBudget => {


    return transaction ? {
        name: transaction.name,
        montant: transaction.montant.toString(),
        errorMontant: '',
        errorName: '',
        typeTransaction: transaction.transactionType,
        typeOperation: transaction.typeOperation,
        categoryTransaction: transaction.categoryID,
        isUnique: transaction.status === 'unique' ? true : false,
        period: transaction.period ? transaction.period : "day"


    } as FormAddBudget : ResetForm()

}

export const defineIDTransaction = (currentMonth: MonthInterface, typeOperation: "income" | "expense"): number => {


    const currentTransaction = currentMonth.transactions[typeOperation];
    const lastTransaction = currentTransaction[currentTransaction.length - 1];
    const id = lastTransaction ? lastTransaction.id + 1 : 1;
    return id;




}