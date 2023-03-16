import { CompteInterface, MonthInterface, SimpleTransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase";

export const deleteOperation = async ({ compte, budget, operation, month }: {
    compte: CompteInterface,
    month: MonthInterface
    budget: TransactionMonthInterface,
    operation: SimpleTransactionInterface,
}) => {

    const _budget: TransactionMonthInterface = { ...budget };
    if (budget.transaction) {
        _budget.transaction = { ...budget.transaction };
        _budget.transaction.expense = [...budget.transaction.expense];
        _budget.transaction.income = [...budget.transaction.income];


        let indexOperation = operation.type === "expense" ?
            _budget.transaction.expense.findIndex((item) => {
                return item.id === operation.id
            }) :
            _budget.transaction.income.findIndex((item) => {
                return item.id === operation.id
            });


        if (indexOperation !== -1) {

            if (operation.type === "expense") {
                _budget.transaction.expense = [
                    ..._budget.transaction.expense.filter((item) => {

                        return item.id !== operation.id


                    })
                ];
            } else {
                _budget.transaction.income = [..._budget.transaction.income.filter((item) => { return item.id !== operation.id })];
            }


            const yearOperation = new Date(operation.date).getFullYear();


            const indexTransaction = compte.transactions.findIndex((year) => {

                return year.year === yearOperation

            })

            if (indexTransaction != -1) {

                const _compte: CompteInterface = { ...compte };

                _compte.transactions = [..._compte.transactions];
                _compte.transactions[indexTransaction] = {
                    ..._compte.transactions[indexTransaction]
                }



                const indexMonth = compte.transactions[indexTransaction].month.findIndex((_month) => {

                    return _month.nameMonth === month.nameMonth;

                })

                if (indexMonth != -1) {

                    const _month = { ...month }
                    _month.transactions = { ...month.transactions }
                    _month.transactions.expense = [...month.transactions.expense]
                    _month.transactions.income = [...month.transactions.income]


                    const indexBudget = _month.transactions[budget.typeOperation].findIndex((item) => {

                        return item.id === budget.id;

                    })


                    if (indexBudget != -1) {



                        if (operation.type === "expense") {

                            _month.transactions.expense[indexBudget] = { ..._budget };

                        } else {

                            _month.transactions.income[indexBudget] = { ..._budget };
                        }


                        _compte.transactions[indexTransaction].month = [..._compte.transactions[indexTransaction].month];

                        _compte.transactions[indexTransaction].month[indexMonth] = { ..._month };




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


                    } else {
                        throw new Error("Budget not found");
                    }


                } else {
                    throw new Error("Month not found");
                }


            } else {
                throw new Error("Transaction not found");
            }
        } else {
            throw new Error("Operation not found");
        }



    } else {
        throw new Error("Transaction not found in the budget");
    }


    throw new Error("ERROR INCONNU");


}