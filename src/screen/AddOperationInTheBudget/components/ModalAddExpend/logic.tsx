import { CompteInterface, MonthInterface, SimpleTransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase";
import { fixedFloatNumber } from "../../../../utils/ExpendManipulation";


export interface FormAddOperationInterface {
    title: string,
    errorTitle: string,
    montant: string,
    errorMontant: string,
    category: number,
    type: "income" | "expense",
    quantity: string,
    errorQuantity: string,
    btnEnabled: boolean,

}

export function calculateTotalExpend(montant: number, quantity: number): number {
    let total = 0;
    total = montant * quantity;
    return fixedFloatNumber(total);

}

export function returnDefaultValueForm(expend?: SimpleTransactionInterface): FormAddOperationInterface {


    if (expend) {
        return {
            title: expend.name,
            errorTitle: "",
            montant: expend.montant.toString(),
            errorMontant: "",
            category: expend.category,
            type: expend.type,
            quantity: expend.quantity.toString(),
            errorQuantity: "",
            btnEnabled: true,
        };
    }

    return resetForm();
}

export function resetForm(): FormAddOperationInterface {
    return {
        title: "",
        errorTitle: "",
        montant: "",
        errorMontant: "",
        category: 1,
        type: "expense",
        quantity: "",
        errorQuantity: "",
        btnEnabled: true,
    };
}

export function fixedQuantity(quantity: string): string {
    if (quantity === "") {
        return "1";
    } else {
        return quantity;
    }
}

export function checkForm({ form, setFormOperation }: {
    form: FormAddOperationInterface,
    setFormOperation: (value: FormAddOperationInterface) => void
}): boolean {

    /* clear old form error */
    form.errorTitle = "";
    form.errorMontant = "";


    if (form.title === "") {
        form.errorTitle = "Le champ est vide";
    } else {
        form.errorTitle = "";
    }
    if (form.montant === "") {
        form.errorMontant = "Le champ est vide";
    } else {
        form.errorMontant = "";
    }
    if (form.quantity === "") {
        form.errorQuantity = "Le champ est vide";
    } else {
        form.errorQuantity = "";
    }



    if (form.errorTitle == "" && form.errorMontant == "" && form.errorQuantity == "") {
        form.btnEnabled = false;

        setFormOperation(form);
        return true
    } else {
        form.btnEnabled = true;
        setFormOperation(form);
    }


    return false;




}

export async function saveOperation({ compteCurrent, CurrentMonth, budget, newOperation, oldOperation }: {

    compteCurrent: CompteInterface,
    CurrentMonth: MonthInterface,
    budget: TransactionMonthInterface,
    newOperation: SimpleTransactionInterface
    oldOperation?: SimpleTransactionInterface | null
}) {



    const request = prepareRequest({ compteCurrent, CurrentMonth, budget, newOperation, oldOperation });


    if (request) {
        const newCompte = await DatabaseManager.UpdateCompte(
            request.compte.id,
            request.compte.name,
            request.compte.pay,
            request.compte.withdrawal,
            request.compte.deposit,
            request.compte.transactions
        );


        return {
            compte: newCompte,
            month: request.month,
            budget: request.budget
        };
    } else {
        /*  une erreur est survenue pendant la preparation de la requête */
        throw new Error("Une erreur est survenue pendant la preparation de la requête");
    }


}

export const createNewOperation = ({ form, budget, oldOperation }: {
    form: FormAddOperationInterface
    budget: TransactionMonthInterface | null | undefined
    oldOperation?: SimpleTransactionInterface | null
}): SimpleTransactionInterface => {

    return {
        id: getLastID(budget, form.type),
        name: form.title,
        montant: parseFloat(form.montant),
        category: form.category,
        type: form.type,
        quantity: parseInt(form.quantity),
        total: calculateTotalExpend(parseFloat(form.montant), parseInt(form.quantity)),
        date: new Date().toDateString(),
        montant_real: 0,
        total_real: 0,

    }


}


function getLastID(budget: TransactionMonthInterface | null | undefined, typeOperation: "income" | "expense"): number {

    if (budget) {

        let lastID: number | undefined = 0;

        if (typeOperation === "income") {

            lastID = budget.transaction?.income[budget.transaction?.income.length - 1]?.id;

        } else {

            lastID = budget.transaction?.expense[budget.transaction?.expense.length - 1]?.id;

        }

        return lastID ? lastID + 1 : 1;
    } else {
        return 1;
    }

}


export function CalculBudget({ budget }: { budget: TransactionMonthInterface }) {

    let total = {
        income: 0,
        expense: 0
    };
    if (budget.transaction) {

        budget.transaction.income.forEach((income) => {
            total.income += income.montant_real == 0 ? income.total : income.total_real;
        });

        budget.transaction.expense.forEach((expend) => {
            total.expense += expend.montant_real == 0 ? expend.total : expend.total_real;
        });

    }

    budget.montant = budget.start_montant;
    budget.montant += total.income;
    budget.montant -= total.expense;
    budget.montant = fixedFloatNumber(budget.montant);



    return budget;
}


function prepareRequest({ compteCurrent, CurrentMonth, budget, newOperation, oldOperation }: {
    compteCurrent: CompteInterface,
    CurrentMonth: MonthInterface,
    budget: TransactionMonthInterface,
    newOperation: SimpleTransactionInterface,
    oldOperation?: SimpleTransactionInterface | null
}) {


    const indexYear = compteCurrent.transactions.findIndex((year) => year.year === new Date().getFullYear());

    if (indexYear !== -1) {

        const indexMonth = compteCurrent.transactions[indexYear].month.findIndex((month) => month.nameMonth === CurrentMonth.nameMonth);

        if (indexMonth !== -1) {

            const indexBudget = compteCurrent.transactions[indexYear].month[indexMonth].transactions[budget.typeOperation].findIndex((_budget) => _budget.id === budget.id);

            if (indexBudget !== -1) {





                let _budget: TransactionMonthInterface = { ...budget };

                _budget.transaction = {
                    ...budget.transaction, income: [..._budget.transaction ? _budget.transaction.income : []]
                    , expense: [..._budget.transaction ? _budget.transaction.expense : []]

                };


                if (oldOperation) {

                    let indexOldOperation = _budget.transaction[oldOperation.type].findIndex((operation) => operation.id === oldOperation.id);

                    if (indexOldOperation !== -1) {
                        _budget.transaction[oldOperation.type].splice(indexOldOperation, 1);
                    }

                }


                if (newOperation.type === "income") {
                    _budget.transaction.income.push(newOperation);
                }
                if (newOperation.type === "expense") {
                    _budget.transaction.expense.push(newOperation);
                }

                let compte = {
                    ...compteCurrent,
                    transactions: [...compteCurrent.transactions]
                };
                compte.transactions[indexYear] = { ...compte.transactions[indexYear] }
                compte.transactions[indexYear].month = [...compte.transactions[indexYear].month];

                let month = {
                    ...CurrentMonth,
                    transactions: { ...CurrentMonth.transactions }
                };
                month.transactions = {
                    income: [...CurrentMonth.transactions.income],
                    expense: [...CurrentMonth.transactions.expense]
                }


                _budget = CalculBudget({
                    budget: _budget,

                });

                month.transactions[budget.typeOperation][indexBudget] = _budget;
                compte.transactions[indexYear].month[indexMonth] = month;

                return {
                    compte: compte,
                    month: month,
                    budget: _budget
                }






            } else {
                /* not index Budget */
                throw new Error("Impossible de trouver l'index du budget");

            }




        } else {
            /* not index month */
            throw new Error("Impossible de trouver l'index du mois");
        }


    } else {
        /* no index Year */
        throw new Error("Impossible de trouver l'index de l'année");
    }


}