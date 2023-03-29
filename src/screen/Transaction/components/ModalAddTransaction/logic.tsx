import { CategoryInterface } from "../../../../redux/categorySlice";
import { CompteInterface, MonthInterface, TransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase"
import { CalculBudget } from "../../../AddOperationInTheBudget/components/ModalAddExpend/logic";
import { getTrad } from "../../../../lang/internationalization";
import { getMonthByNumber } from "../../../../utils/DateManipulation";

export interface FormAddBudget {
    name: string,
    montant: string,
    errorMontant: string,
    errorName: string,
    typeTransaction: "Spent" | "Budget" | "BankTransfers",
    typeOperation: "income" | "expense",
    period: "month" | "year",
    categoryTransaction: number,
    isUnique: boolean,
    idTransfert: number
    nameCompteTransfer: string | null
}

export const getAllCategory = async () => {


    const _category: CategoryInterface[] = await DatabaseManager.GetAllCategory();

    return _category;



}


export function ResetForm(): FormAddBudget {
    return { name: '', montant: '', errorMontant: '', errorName: '', typeTransaction: 'Spent', typeOperation: 'expense', categoryTransaction: 1, isUnique: true, period: "month", idTransfert: 1, nameCompteTransfer: "" };
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
        isClosed: oldOperation ? oldOperation.isClosed : false,
        transaction: formAddBudget.typeTransaction === "Spent" ? null : { income: [], expense: [] },
        idTransfer: formAddBudget.typeTransaction === "BankTransfers" ? formAddBudget.idTransfert : null,
        nameCompteTransfer: formAddBudget.typeTransaction === "BankTransfers" ? formAddBudget.nameCompteTransfer : null

    }

}


interface SaveTransactionInterface {
    currentCompte: CompteInterface,
    currentMonth: MonthInterface,
    newTransaction: TransactionMonthInterface,
    useOverdraw?: boolean,
    AllComptes: CompteInterface[]
}

export const saveTransaction = async ({ currentCompte, currentMonth, newTransaction, useOverdraw, AllComptes }: SaveTransactionInterface) => {


    const over = getOverdrawn(currentCompte, newTransaction, useOverdraw);

    if (over.overdrawn && !useOverdraw && newTransaction.typeOperation === 'expense') {

        const _message = currentCompte.discovered && currentCompte.discoveredMontant > 0 ?
            `${getTrad("DoYouWantUseYourOverdraft")} ${currentCompte.discoveredMontant}€ ?` :
            getTrad("YouCannotSpendMoreYouHaveInAccount");

        const alert = generateAlert({
            currentCompte: currentCompte,
            currentMonth: currentMonth,
            type: getTrad('Information'),
            message: _message,
            action: {
                valider: {
                    text: getTrad('yes'),
                    action: async () => {
                        return await saveTransaction({
                            currentCompte, currentMonth, newTransaction,
                            useOverdraw: true,
                            AllComptes
                        })
                    }
                },
                annuler: {
                    text: getTrad('no'),
                    action: () => {
                        return {
                            compte: currentCompte,
                            month: currentMonth,
                            alert: null
                        }
                    }
                }
            }
        });
        return alert;


    } else if (over.overdrawn && useOverdraw && over.discoveredExceed && newTransaction.typeOperation === 'expense') {
        const alert = generateAlert({
            currentCompte: currentCompte,
            currentMonth: currentMonth,
            type: getTrad('error'),
            message: `${getTrad("YouCannotUseOverdraft")} ${currentCompte.discoveredMontant}€`,

        });
        return alert;
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

        return generateAlert({
            currentCompte: currentCompte,
            currentMonth: currentMonth,
            type: getTrad('error'),
            message: getTrad("WeAreUnableFindTransactionsForCurrentYear"),
        });

    }

    if (newTransaction.status !== 'unique') {


        const transactionIndex = curentYearTransaction.operationRecurring[newTransaction.typeOperation].findIndex((transaction: TransactionMonthInterface, index) => {

            return transaction.name === newTransaction.name;

        });
        if (transactionIndex === -1) {
            curentYearTransaction.operationRecurring[newTransaction.typeOperation].push(newTransaction);
        } else {

            return generateAlert({
                currentCompte: currentCompte,
                currentMonth: currentMonth,
                type: getTrad('error'),
                message: getTrad("YouAlreadyHaveARecurringTransactionWithThisName"),
            });


        }
    }



    /*SAVE TRANSACTION MONTH */

    const indexCurrentMonth = curentYearTransaction.month.findIndex((month: MonthInterface, index) => {
        return month.nameMonth === newCurrentMonth.nameMonth;
    });

    if (indexCurrentMonth === -1) {

        return generateAlert({
            currentCompte: currentCompte,
            currentMonth: currentMonth,
            type: getTrad('error'),
            message: getTrad("WeAreUnableFindTransactionsForCurrentMonth"),
        });


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

        if (newTransaction.transactionType === "BankTransfers") {

            const _result = await Transfer({
                newTransaction: newTransaction,
                AllComptes: AllComptes
            });

            if (_result) {
                return {
                    compte: newCurrentCompte,
                    month: newCurrentMonth,
                    AllComptes: _result,
                    alert: null
                }
            }

        } else {
            return {
                compte: newCurrentCompte,
                month: newCurrentMonth,
                AllComptes: [],
                alert: null
            }
        }

    }

    return generateAlert({
        currentCompte: currentCompte,
        currentMonth: currentMonth,
        type: getTrad('error'),
        message: getTrad("WeAreUnableSaveTransaction"),
    });
}


export const UpdateTransaction = async ({ oldTransaction, curentCompte, curentMonth, newTransaction, AllComptes }:
    {
        oldTransaction: TransactionMonthInterface,
        curentCompte: CompteInterface,
        curentMonth: MonthInterface,
        newTransaction: TransactionMonthInterface,
        AllComptes: CompteInterface[]
    }) => {

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



    const result = await DatabaseManager.UpdateCompte(
        curentCompte.id,
        curentCompte.name,
        curentCompte.pay,
        curentCompte.withdrawal,
        curentCompte.deposit,
        curentCompte.transactions
    );

    if (result) {

        if (newTransaction.transactionType === "BankTransfers") {

            const newAllComptes = await Transfer({
                newTransaction: newTransaction,
                AllComptes: AllComptes,
                oldTransaction: oldTransaction
            });

            if (newAllComptes) {
                return {
                    compte: result,
                    month: curentMonth,
                    AllComptes: newAllComptes,
                    alert: null
                }
            }
        } else {

            return {

                compte: result,
                month: curentMonth,
                AllComptes: [],
                alert: null
            };
        }
    }

    return generateAlert({
        currentCompte: curentCompte,
        currentMonth: curentMonth,
        type: getTrad('error'),
        message: getTrad("WeAreUnableSaveTransaction"),
    });
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
        result.deposit += parseFloat(curentMontant.toFixed(2));
        result.pay += parseFloat(curentMontant.toFixed(2));
    })

    currentMonth.transactions.expense.forEach((transaction: TransactionMonthInterface) => {
        const curentMontant = transaction.transactionType === "Spent" ? transaction.montant : transaction.start_montant;
        result.withdrawal += parseFloat(curentMontant.toFixed(2));
        result.pay -= parseFloat(curentMontant.toFixed(2));
    })



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
        period: transaction.period ? transaction.period : "month",
        idTransfert: transaction.idTransfer ? transaction.idTransfer : 0,
        nameCompteTransfer: transaction.nameCompteTransfer ? transaction.nameCompteTransfer : "",


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


interface GenerateAlertInterface {
    currentCompte: CompteInterface,
    currentMonth: MonthInterface,
    type: any,
    message?: string,
    action?: {
        valider: {
            text: string,
            action: any
        },
        annuler: {
            text: string,
            action: any

        }
    }

}

function generateAlert({
    currentCompte,
    currentMonth,
    type,
    message,
    action,
}: GenerateAlertInterface) {

    return {
        compte: currentCompte,
        month: currentMonth,
        AllComptes: [],
        alert: message ? {
            type: getTrad(type),
            message: message,
            action: action ? {
                valider: {
                    text: action.valider.text,
                    action: action.valider.action
                },
                annuler: {
                    text: action.annuler.text,
                    action: action.annuler.action
                }

            } : null
        } : null

    }


}


interface TransferInterface {
    AllComptes: CompteInterface[],

    newTransaction: TransactionMonthInterface,
    oldTransaction?: TransactionMonthInterface | null,
}

async function Transfer({ AllComptes, newTransaction, oldTransaction,

}: TransferInterface) {
    const newAllCOmptes: CompteInterface[] = JSON.parse(JSON.stringify(AllComptes));

    const indexCompte = newAllCOmptes.findIndex((compte: CompteInterface) => {
        return compte.id === newTransaction.idTransfer;
    });

    if (indexCompte == -1) throw new Error("Compte Receveur introuvable");

    const compteReceveur = newAllCOmptes[indexCompte];
    const indexYear = compteReceveur.transactions.findIndex((transactionsParYear: TransactionInterface) => {
        return transactionsParYear.year === new Date().getFullYear();
    });

    const transactionsParYear = compteReceveur.transactions[indexYear];

    const indexMonth = transactionsParYear.month.findIndex((month: MonthInterface) => {
        return month.nameMonth === getMonthByNumber(new Date().getMonth() + 1)
    });

    if (indexMonth == -1) throw new Error("Mois introuvable");

    const month = transactionsParYear.month[indexMonth];

    const IDTransactionTransfer = defineIDTransaction(month, "income");

    if (oldTransaction) {
        month.transactions.income = month.transactions.income.filter((transaction: TransactionMonthInterface) => {
            return transaction.name !== oldTransaction.name;
        })

    }
    const newTransactionTransfer = createNewTransaction(
        IDTransactionTransfer,
        {
            name: newTransaction.name,
            montant: newTransaction.montant.toString(),
            typeOperation: "income",
            typeTransaction: newTransaction.transactionType,
            categoryTransaction: newTransaction.categoryID,
            isUnique: true,
            idTransfert: newTransaction.id,
            nameCompteTransfer: newTransaction.nameCompteTransfer,
            period: newTransaction.period ? newTransaction.period : "month",
            errorMontant: '',
            errorName: '',
        });

    newTransactionTransfer.isClosed = true;

    month.transactions.income.push(newTransactionTransfer);





    compteReceveur.transactions[indexYear].month[indexMonth] = month;

    const newResult = calculTransactionByCompte(compteReceveur, month);

    compteReceveur.pay = newResult.pay;
    compteReceveur.withdrawal = newResult.withdrawal;
    compteReceveur.deposit = newResult.deposit;

    newAllCOmptes[indexCompte] = compteReceveur;



    const result = await DatabaseManager.UpdateCompte(
        compteReceveur.id,
        compteReceveur.name,
        compteReceveur.pay,
        compteReceveur.withdrawal,
        compteReceveur.deposit,
        compteReceveur.transactions
    );

    if (!result) throw new Error("Erreur lors de la mise à jour du compte receveur");

    return newAllCOmptes;

}