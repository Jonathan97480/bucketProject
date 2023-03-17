import { CompteInterface, MonthInterface, SimpleTransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase";
import { CalculBudget } from "../ModalAddExpend/logic";

export const deleteOperation = async ({ compte, budget, operation, month }: {
    compte: CompteInterface,
    month: MonthInterface
    budget: TransactionMonthInterface,
    operation: SimpleTransactionInterface,
}) => {

    let _budget = prepareBudget(budget);


    if (!_budget.transaction) throw new Error("Budget not transaction");


    const indexOperation = getIndexOperationInTheBudget(_budget, operation);


    if (indexOperation === -1) throw new Error("Index operation not found");


    _budget = deleteOperationInTheBudget(_budget, operation);


    const yearOperation = new Date(operation.date).getFullYear();


    const indexYearInTheTransaction = compte.transactions.findIndex((year) => {

        return year.year === yearOperation

    })

    if (indexYearInTheTransaction === -1) throw new Error("Year not found");

    const _compte: CompteInterface = prepareCompte(compte, indexYearInTheTransaction);



    const indexMonth = compte.transactions[indexYearInTheTransaction].month.findIndex((_month) => {

        return _month.nameMonth === month.nameMonth;

    })

    if (indexMonth === -1) throw new Error("Month not found");

    const _month = prepareMonth(month);


    const indexBudget = _month.transactions[budget.typeOperation].findIndex((item) => {

        return item.id === budget.id;

    })


    if (indexBudget === -1) throw new Error("Budget not found");


    _month.transactions[operation.type][indexBudget] = { ..._budget };

    _compte.transactions[indexYearInTheTransaction].month[indexMonth] = { ..._month };

    const newCompte = await DatabaseManager.UpdateCompte(
        _compte.id,
        _compte.name,
        _compte.pay,
        _compte.withdrawal,
        _compte.deposit,
        _compte.transactions
    )



    return {
        compte: newCompte,
        budget: _budget,
        month: _month
    };


    throw new Error("ERROR INCONNU");

}


function prepareBudget(budget: TransactionMonthInterface) {

    const _budget: TransactionMonthInterface = { ...budget };

    if (budget.transaction) {
        _budget.transaction = { ...budget.transaction };
        _budget.transaction.expense = [...budget.transaction.expense];
        _budget.transaction.income = [...budget.transaction.income];
    }

    return _budget;
}


function prepareCompte(compte: CompteInterface, indexYearInTheTransaction: number) {

    const _compte: CompteInterface = { ...compte };

    _compte.transactions = [..._compte.transactions];
    _compte.transactions[indexYearInTheTransaction] = {
        ..._compte.transactions[indexYearInTheTransaction]
    }

    _compte.transactions[indexYearInTheTransaction].month = [..._compte.transactions[indexYearInTheTransaction].month];

    return _compte;
}

function prepareMonth(month: MonthInterface) {

    const _month = { ...month }
    _month.transactions = { ...month.transactions }
    _month.transactions.expense = [...month.transactions.expense]
    _month.transactions.income = [...month.transactions.income]

    return _month;
}


function getIndexOperationInTheBudget(budget: TransactionMonthInterface, operation: SimpleTransactionInterface) {

    if (!budget.transaction) throw new Error("Budget not found");

    const indexOperation = budget.transaction[operation.type].findIndex((item) => {
        return item.id === operation.id
    })
    return indexOperation;
}


function deleteOperationInTheBudget(budget: TransactionMonthInterface, operation: SimpleTransactionInterface) {

    if (!budget.transaction) throw new Error("Budget not transaction")

    if (operation.type === "expense") {
        budget.transaction.expense = [
            ...budget.transaction.expense.filter((item) => {

                return item.id !== operation.id


            })
        ];
    } else {
        budget.transaction.income = [...budget.transaction.income.filter((item) => { return item.id !== operation.id })];
    }

    budget = CalculBudget({ budget: budget });

    return budget;
}