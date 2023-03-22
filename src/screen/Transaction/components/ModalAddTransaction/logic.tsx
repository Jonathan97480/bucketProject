import { CategoryInterface } from "../../../../redux/categorySlice";
import { CompteInterface, MonthInterface, SimpleTransactionInterface, TransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase"
import { calculateTotalExpend, CalculBudget } from "../../../AddOperationInTheBudget/components/ModalAddExpend/logic";


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

export const createNewTransaction = (index: number, formAddBudget: FormAddBudget, oldOperation?: TransactionMonthInterface | null): TransactionMonthInterface => {

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

export const saveTransaction = async (currentCompte: CompteInterface, currentMonth: MonthInterface, newTransaction: TransactionMonthInterface) => {

    currentCompte.transactions.find((transactionsParYear: TransactionInterface, index) => {

        /* Save TRANSACTION RECURRING */
        if (transactionsParYear.year === new Date().getFullYear()) {

            if (newTransaction.status !== 'unique') {

                transactionsParYear = { ...transactionsParYear, operationRecurring: { ...transactionsParYear.operationRecurring } }

                const tIndex = transactionsParYear.operationRecurring[newTransaction.typeOperation].findIndex((transaction: TransactionMonthInterface, index) => {

                    return transaction.name === newTransaction.name;

                });
                if (tIndex === -1) {
                    transactionsParYear.operationRecurring[newTransaction.typeOperation] = [...transactionsParYear.operationRecurring[newTransaction.typeOperation], newTransaction];
                } else {
                    transactionsParYear.operationRecurring[newTransaction.typeOperation][tIndex] = newTransaction;
                }
            }

            /* Save TRANSACTION MONTH */

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


export const UpdateTransaction = async ({ oldTransaction, curentCompte, curentMonth, newTransaction }:
    {
        oldTransaction: TransactionMonthInterface,
        curentCompte: CompteInterface,
        curentMonth: MonthInterface,
        newTransaction: TransactionMonthInterface
    }): Promise<{
        compte: CompteInterface,
        curentMonth: MonthInterface
    }> => {

    curentCompte = JSON.parse(JSON.stringify(curentCompte));
    curentMonth = JSON.parse(JSON.stringify(curentMonth));





    /* Mise ajour de la transaction dans le moi courant */
    if (newTransaction.typeOperation === oldTransaction.typeOperation) {

        curentMonth.transactions[newTransaction.typeOperation] = curentMonth.transactions[newTransaction.typeOperation].map((transaction: TransactionMonthInterface) => {
            if (transaction.id === oldTransaction.id) {
                return newTransaction;
            }
            return transaction;
        })

    } else {

        curentMonth.transactions[oldTransaction.typeOperation] = curentMonth.transactions[oldTransaction.typeOperation].filter((transaction: TransactionMonthInterface) => {
            return transaction.id !== oldTransaction.id;
        })

        curentMonth.transactions[newTransaction.typeOperation].push(newTransaction);

    }

    /* save old Operation */
    if (oldTransaction && oldTransaction.transactionType === "Budget" && newTransaction.transactionType === "Budget") {

        newTransaction.transaction = oldTransaction.transaction;

        newTransaction = CalculBudget({

            budget: newTransaction
        });
    }


    /* Mise ajour des opérations récurant si nécessaire */
    if (newTransaction.status === "recurring" || oldTransaction.status === "recurring") {

        curentCompte.transactions.find((transactionsParYear: TransactionInterface, index) => {

            if (transactionsParYear.year === new Date().getFullYear()) {

                if (oldTransaction.status === "recurring") {

                    transactionsParYear.operationRecurring[oldTransaction.typeOperation] = transactionsParYear.operationRecurring[oldTransaction.

                        typeOperation].filter((transaction: TransactionMonthInterface) => {
                            return transaction.name !== oldTransaction.name;

                        })
                }

                if (newTransaction.status === "recurring") {
                    transactionsParYear.operationRecurring[newTransaction.typeOperation].push(newTransaction);
                }
            }

        });
    }



    const IndexYear = curentCompte.transactions.findIndex((transactionsParYear: TransactionInterface) => {
        return transactionsParYear.year === new Date().getFullYear();
    });

    const IndexMonth = curentCompte.transactions[IndexYear].month.findIndex((month: MonthInterface) => {
        return month.nameMonth === curentMonth.nameMonth;
    });

    curentCompte.transactions[IndexYear].month[IndexMonth] = curentMonth;


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
        const curentMontant = transaction.transactionType === "Spent" ? transaction.montant : transaction.start_montant;
        result.deposit += curentMontant;
        result.pay += curentMontant;
    })

    currentMonth.transactions.expense.forEach((transaction: TransactionMonthInterface) => {
        const curentMontant = transaction.transactionType === "Spent" ? transaction.montant : transaction.start_montant;
        result.withdrawal += curentMontant;
        result.pay -= curentMontant;
    })

    console.log("RESULT", result);

    return result;

}

export const defineFormAddBudget = (transaction: TransactionMonthInterface | undefined | null): FormAddBudget => {


    return transaction ? {
        name: transaction.name,
        montant: transaction.start_montant.toString(),
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