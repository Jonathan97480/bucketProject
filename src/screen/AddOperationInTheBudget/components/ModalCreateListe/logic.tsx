import { SimpleTransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import { listInterface, stepInterface } from "../../../../redux/listSlice";
import DatabaseManager from "../../../../utils/DataBase";

export async function CreateListe({ budget, selectorElements }: {
    budget: TransactionMonthInterface;
    selectorElements: 'All' | 'Income' | 'Expense';
}) {

    let operations: SimpleTransactionInterface[] = [];

    if (budget.transaction === null) throw new Error('Nous ne trouvons pas de transaction pour ce budget');

    switch (selectorElements) {
        case 'All':

            operations = [...budget.transaction.income, ...budget.transaction.expense];

            break;

        case 'Income':

            operations = [...budget.transaction.income];

            break;

        case 'Expense':

            operations = [...budget.transaction.expense];

            break;

        default:

            operations = [...budget.transaction.income, ...budget.transaction.expense];
            break;


    }

    const stepArray = createStep(operations);

    let list = await DatabaseManager.createList(budget.name)
    list = await updateListe(stepArray, list);

    return list;

}


function createStep(Operations: SimpleTransactionInterface[]) {

    const stepArray: stepInterface[] = [];

    Operations.forEach((operation) => {

        stepArray.push({
            id: operation.id,
            name: operation.name,
            montant: operation.montant,
            date: operation.date,
            category: operation.category.toString(),
            quantity: operation.quantity,
            type: operation.type,
            isChecked: false,
        })

    });

    return stepArray;
}


async function updateListe(stepArray: stepInterface[], _list: listInterface) {

    let list: listInterface = {
        id: _list.id,
        name: _list.name,
        montant: _list.montant,
        date: _list.date,
        steps: stepArray,
        validate: false,
        task: stepArray.length,
        taskTerminer: 0,
    }


    list = await DatabaseManager.updateList(list);

    return list;
}