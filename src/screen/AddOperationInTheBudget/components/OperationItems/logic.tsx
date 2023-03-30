import { CompteInterface, MonthInterface, SimpleTransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase";

export const deleteOperation = async ({ compte, budget, operation, month }: {
    compte: CompteInterface,
    month: MonthInterface
    budget: TransactionMonthInterface,
    operation: SimpleTransactionInterface,
}) => {


    const _budget: TransactionMonthInterface = {
        categoryID: budget.categoryID,
        id: budget.id,
        montant: budget.montant,
        start_montant: budget.start_montant,
        transaction: {
            expense: [...budget.transaction!.expense],
            income: [...budget.transaction!.income]
        },
        transactionType: budget.transactionType,
        typeOperation: budget.typeOperation,
        name: budget.name,
        date: budget.date,
        status: budget.status,
        period: budget.period,
        montant_real: budget.montant_real,
        idTransfer: budget.idTransfer,
        nameCompteTransfer: budget.nameCompteTransfer,
    };



    let indexOperation = _budget.transaction![operation.type].findIndex((item) => {
        return item.id === operation.id
    });
    console.log("DELETE OPERATION", operation, _budget.transaction![operation.type], indexOperation, "BUDGET", _budget);
    if (indexOperation !== -1) {


        _budget.transaction![operation.type] = [
            ..._budget.transaction![operation.type].filter((item) => { return item.id !== operation.id })
        ];




        let total = {
            income: 0,
            expense: 0
        };


        _budget.transaction!.income.forEach((income) => {
            total.income += income.montant_real == 0 ? income.total : income.total_real;
        });

        _budget.transaction!.expense.forEach((expend) => {
            total.expense += expend.montant_real == 0 ? expend.total : expend.total_real;
        });



        _budget.montant = _budget.start_montant;
        _budget.montant += total.income;
        _budget.montant -= total.expense;


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


                    _month.transactions[budget.typeOperation][indexBudget] = { ..._budget };


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

}