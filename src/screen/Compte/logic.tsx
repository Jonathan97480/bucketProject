import { CompteInterface, MonthInterface, TransactionInterface, TransactionMonthInterface } from "../../redux/comptesSlice";
import DatabaseManager from "../../utils/DataBase";
import { getMonthByNumber } from "../../utils/DateManipulation";
import { GetAllComptes, UpdateCompte } from "../AllCompte/logic";
import { calculTransactionByCompte } from "../Transaction/components/ModalAddTransaction/logic";

export const FixeIsYearAndMonthExist = async (currentCompte: CompteInterface, id_user: number) => {


    const curentIndexYear = currentCompte.transactions.findIndex((transaction) => {
        return transaction.year === new Date().getFullYear();
    })


    const compteUpdate = UpdateRecurringOperation(currentCompte, curentIndexYear);


    let result: CompteInterface = { ...currentCompte }
    if (compteUpdate) {
        await UpdateCompte(compteUpdate);
        const AllComptes = await GetAllComptes(id_user);

        return {
            compte: compteUpdate,
            AllComptes: AllComptes
        }
    }



    return {
        compte: result,
        AllComptes: null
    };


}


const UpdateRecurringOperation = (curentCompte: CompteInterface, indexYear: number) => {

    const NewCurentCompte: CompteInterface = JSON.parse(JSON.stringify(curentCompte));

    const curentYearTransaction = { ...NewCurentCompte.transactions[indexYear] };

    const curentMonthIndex = curentYearTransaction.month.findIndex((transaction) => {
        return transaction.nameMonth === getMonthByNumber(new Date().getMonth() + 1);
    })


    const NewMonthTransaction = injectRecurringOperationNewMonth({ ...curentYearTransaction.month[curentMonthIndex] }, curentYearTransaction);

    if (NewMonthTransaction === null) return null

    NewCurentCompte.pay = NewMonthTransaction.AccountBalanceBeginningMonth === null ? curentCompte.pay : NewMonthTransaction.AccountBalanceBeginningMonth;

    curentYearTransaction.month[curentMonthIndex] = NewMonthTransaction;

    NewCurentCompte.transactions[indexYear] = curentYearTransaction

    return NewCurentCompte


}

function injectRecurringOperationNewMonth(NewMonthTransaction: MonthInterface, curentYearTransaction: TransactionInterface) {


    if (NewMonthTransaction.transactions.expense.length === 0 && NewMonthTransaction.transactions.income.length === 0) {



        if (curentYearTransaction.operationRecurring.expense.length > 0 || curentYearTransaction.operationRecurring.income.length > 0) {


            NewMonthTransaction = JSON.parse(JSON.stringify(NewMonthTransaction));



            NewMonthTransaction.transactions.expense = returnRecurringOperationUpdate(curentYearTransaction.operationRecurring.expense);
            NewMonthTransaction.transactions.income = returnRecurringOperationUpdate(curentYearTransaction.operationRecurring.income);





            NewMonthTransaction.numberTransactionMonth = curentYearTransaction.operationRecurring.expense.length + curentYearTransaction.operationRecurring.income.length;

            let total = {
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
        } else {
            return null
        }
    } else {
        return null
    }


    return NewMonthTransaction;


}

const returnRecurringOperationUpdate = (operations: TransactionMonthInterface[]) => {


    const curentYear = new Date().getFullYear();
    const curentMonth = getMonthByNumber(new Date().getMonth() + 1);

    const newOperationObjet = SortByMonthAndYear(operations);


    const curentYearTransaction = newOperationObjet.year.filter((transaction) => {

        return new Date(transaction.date).getFullYear() !== curentYear;
    });


    const curentMonthTransaction = newOperationObjet.month.filter((transaction) => {
        return getMonthByNumber(new Date(transaction.date).getMonth() + 1) !== curentMonth;
    });

    return PushAndUpdateOperation([], curentYearTransaction, curentMonthTransaction);


}

const SortByMonthAndYear = (operations: TransactionMonthInterface[]) => {
    const newOperationObjet = {
        year: [] as TransactionMonthInterface[],
        month: [] as TransactionMonthInterface[],
    }

    operations.forEach((operation) => {
        if (operation.period === "year") {
            newOperationObjet.year.push(operation)
        } else {
            newOperationObjet.month.push(operation)
        }
    });

    return newOperationObjet;
}


const PushAndUpdateOperation = (operations: TransactionMonthInterface[], curentYearTransaction: TransactionMonthInterface[], curentMonthTransaction: TransactionMonthInterface[]) => {


    const newOperations = [...operations];

    curentYearTransaction.forEach((_operation) => {

        _operation.date = new Date().toString();
        if (_operation.transactionType === "BankTransfers") {
            transferAmountInOtherCompte(_operation)
        }
        newOperations.push(_operation)


    })

    curentMonthTransaction.forEach((_operation) => {
        _operation.date = new Date().toString();

        if (_operation.transactionType === "BankTransfers") {
            transferAmountInOtherCompte(_operation)
        }
        newOperations.push(_operation)

    })




    return newOperations;

}

async function transferAmountInOtherCompte(operation: TransactionMonthInterface) {

    if (operation.idTransfer === null) throw new Error("l'id pour le transfer de compte a compte est manquant ")

    const comptTransfert = await DatabaseManager.GetCompteByID(operation.idTransfer);

    const indexYear = comptTransfert.transactions.findIndex((YearTransaction) => {

        return YearTransaction.year === new Date().getFullYear();

    })

    const indexMonth = comptTransfert.transactions[indexYear].month.findIndex((monthTransaction) => {

        return monthTransaction.nameMonth === getMonthByNumber(new Date().getMonth() + 1)
    })
    operation.isClosed = true;



    comptTransfert.transactions[indexYear].month[indexMonth].transactions.income.push(operation);
    comptTransfert.transactions[indexYear].month[indexMonth].numberTransactionMonth += 1;

    const result = calculTransactionByCompte(comptTransfert, comptTransfert.transactions[indexYear].month[indexMonth]);

    comptTransfert.pay = result.pay;
    comptTransfert.withdrawal = result.withdrawal;
    comptTransfert.deposit = result.deposit;




    UpdateCompte(comptTransfert);


}