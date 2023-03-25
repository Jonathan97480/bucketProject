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

export const saveTransaction = async (currentCompte: CompteInterface, currentMonth: MonthInterface, newTransaction: TransactionMonthInterface, useOverdraw?: boolean) => {


    const over = getOverdrawn(currentCompte, newTransaction, useOverdraw);

    if (over.overdrawn && !useOverdraw) {

        return {
            compte: currentCompte,
            month: currentMonth,
            alert: {
                type: 'Information',
                message: currentCompte.discovered && currentCompte.discoveredMontant > 0 ?
                    `Voulez vous utiliser votre découvert de ${currentCompte.discoveredMontant}€` :
                    `Vous ne pouvez pas dépenser plus que vous n’avez dans votre compte`,
                action: currentCompte.discovered && currentCompte.discoveredMontant > 0 ? {
                    valider: {
                        text: 'Oui',
                        action: async () => {
                            return await saveTransaction(currentCompte, currentMonth, newTransaction, true)
                        }

                    },
                    annuler: {
                        text: 'Non',
                        action: () => {
                            return {
                                compte: currentCompte,
                                month: currentMonth,
                                alert: null
                            }
                        }
                    }
                } : null
            }

        }

    } else if (over.overdrawn && useOverdraw && over.discoveredExceed) {
        return {
            compte: currentCompte,
            month: currentMonth,
            alert: {
                type: 'error',
                message: `Vous ne pouvez pas utiliser votre découvert de ${currentCompte.discoveredMontant}€`,
                action: null
            }
        }
    }


    let newCurrentCompte: CompteInterface = JSON.parse(JSON.stringify(currentCompte));
    let newCurrentMonth: MonthInterface = JSON.parse(JSON.stringify(currentMonth));


    const curentYearTransaction = newCurrentCompte.transactions.find((transactionsParYear: TransactionInterface, index) => {
        return transactionsParYear.year === new Date().getFullYear();
    });

    const curentYearIndex = newCurrentCompte.transactions.findIndex((transactionsParYear: TransactionInterface, index) => {
        return transactionsParYear.year === new Date().getFullYear();
    });


    if (!curentYearTransaction || curentYearIndex === -1) {

        return {
            compte: newCurrentCompte,
            month: newCurrentMonth,
            alert: {
                type: 'error',
                message: 'Nous ne parvenons pas a trouver les transactions de l’année en cours',
                action: null
            }

        }
    }

    if (newTransaction.status !== 'unique') {


        const transactionIndex = curentYearTransaction.operationRecurring[newTransaction.typeOperation].findIndex((transaction: TransactionMonthInterface, index) => {

            return transaction.name === newTransaction.name;

        });
        if (transactionIndex === -1) {
            curentYearTransaction.operationRecurring[newTransaction.typeOperation].push(newTransaction);
        } else {
            return {
                compte: newCurrentCompte,
                month: newCurrentMonth,
                alert: {
                    type: 'error',
                    message: 'Une Operation avec le même nom existe déjà dans les operation récurrente Veuillez changer le nom de l’operation',
                    action: null

                }

            }
        }
    }

    /*SAVE TRANSACTION MONTH */

    const indexCurrentMonth = curentYearTransaction.month.findIndex((month: MonthInterface, index) => {
        return month.nameMonth === newCurrentMonth.nameMonth;
    });

    if (indexCurrentMonth === -1) {
        return {
            compte: newCurrentCompte,
            month: newCurrentMonth,
            alert: {
                type: 'error',
                message: 'Nous ne parvenons pas a trouver le mois en cours',
                action: null
            }
        }
    }


    newCurrentMonth.transactions[newTransaction.typeOperation].push(newTransaction);
    newCurrentMonth.numberTransactionMonth = newCurrentMonth.transactions.income.length + newCurrentMonth.transactions.expense.length;

    curentYearTransaction.month[indexCurrentMonth] = newCurrentMonth;
    curentYearTransaction.numberTransactionYear += 1;

    newCurrentCompte.transactions[curentYearIndex] = curentYearTransaction;


    const newResultCompte = calculTransactionByCompte(newCurrentCompte, newCurrentMonth);

    newCurrentCompte.pay = newResultCompte.pay;
    newCurrentCompte.withdrawal = newResultCompte.withdrawal;
    newCurrentCompte.deposit = newResultCompte.deposit;

    let result = await DatabaseManager.UpdateCompte(
        newCurrentCompte.id,
        newCurrentCompte.name,
        newCurrentCompte.pay,
        newCurrentCompte.withdrawal,
        newCurrentCompte.deposit,
        newCurrentCompte.transactions
    );


    if (result) {


        return {
            compte: newCurrentCompte,
            month: newCurrentMonth,
            alert: null
        }
    }

    return {
        compte: newCurrentCompte,
        month: newCurrentMonth,
        alert: {
            type: 'error',
            message: 'Une erreur est survenue lors de la sauvegarde de la transaction',
            action: null
        }
    }

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



    const IndexYear = curentCompte.transactions.findIndex((transactionsParYear: TransactionInterface) => {
        return transactionsParYear.year === new Date().getFullYear();
    });
    const IndexMonth = curentCompte.transactions[IndexYear].month.findIndex((month: MonthInterface) => {
        return month.nameMonth === curentMonth.nameMonth;
    });

    newTransaction = saveOldOperation(oldTransaction, newTransaction);


    const newYearTransaction = UpdateRecurringTransaction(oldTransaction, newTransaction, curentCompte);

    if (newYearTransaction) {
        curentCompte.transactions[IndexYear] = newYearTransaction;
    }

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


function saveOldOperation(oldTransaction: TransactionMonthInterface, newTransaction: TransactionMonthInterface) {
    /* save old Operation */
    if (oldTransaction && oldTransaction.transactionType === "Budget" && newTransaction.transactionType === "Budget") {

        newTransaction.transaction = oldTransaction.transaction;

        newTransaction = CalculBudget({

            budget: newTransaction
        });
    }
    return newTransaction;
}


function UpdateRecurringTransaction(oldTransaction: TransactionMonthInterface, newTransaction: TransactionMonthInterface, curentCompte: CompteInterface) {


    let newTransactionYear: TransactionInterface | null = null




    /* Mise ajour des opérations récurant si nécessaire */
    if (newTransaction.status === "recurring" || oldTransaction.status === "recurring") {

        const indexYear = curentCompte.transactions.findIndex((transactionsParYear: TransactionInterface) => {
            return transactionsParYear.year === new Date().getFullYear();
        });

        const transactionsParYear = curentCompte.transactions[indexYear];

        if (oldTransaction.status === "recurring") {

            transactionsParYear.operationRecurring[oldTransaction.typeOperation] = transactionsParYear.operationRecurring[oldTransaction.

                typeOperation].filter((transaction: TransactionMonthInterface) => {
                    return transaction.name !== oldTransaction.name;

                })
        }

        if (newTransaction.status === "recurring") {
            transactionsParYear.operationRecurring[newTransaction.typeOperation].push(newTransaction);
        }

        newTransactionYear = transactionsParYear;

        return newTransactionYear;
    }

    return newTransactionYear;
}


const getOverdrawn = (compte: CompteInterface, newTransaction: TransactionMonthInterface, useOverdraw?: boolean) => {

    const newMontant = compte.pay - newTransaction.montant;
    const overdrawn = newMontant < 0 ? true : false;
    const discoveredExceed = (compte.pay + compte.discoveredMontant) - newTransaction.montant < 0 ? true : false;

    return {
        overdrawn: overdrawn,
        discoveredExceed: discoveredExceed
    };

}