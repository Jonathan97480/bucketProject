import { getTrad } from "../../lang/internationalization";
import { listInterface } from "../../redux/listSlice";
import DatabaseManager from "../../utils/DataBase";
import { getDate } from "../../utils/DateManipulation";
import { generateAlert, TextCompare } from "../../utils/TextManipulation";



export async function addTask({ value, list }: { value: string, list: listInterface }) {

    const newList: listInterface = JSON.parse(JSON.stringify(list));

    newList.steps.push({
        id: 0,
        name: value,
        quantity: 0,
        isChecked: false,
        date: getDate(),
        montant: 0,
        category: "autre",
        type: "achat",
    });

    const AllList = await UpdateList({
        isChecked: false,
        id: newList.steps.length - 1,
        ItemArray: newList.steps,
        list: newList
    });

    return AllList;


}


export async function UpdateList({ isChecked, id, ItemArray, list }:
    { isChecked: boolean, id: number, ItemArray?: any, list: listInterface }) {

    let newItemArray = ItemArray ? [...ItemArray] : [...list.steps];
    let index = newItemArray.findIndex((item) => item.id === id);
    newItemArray[index] = {
        ...newItemArray[index],
        isChecked: isChecked
    }


    await DatabaseManager.updateList({
        id: list.id,
        name: list.name,
        montant: list.montant,
        date: list.date,
        steps: newItemArray,
        validate: list.validate,
        task: newItemArray.length,


    })

    const allList = await DatabaseManager.getAllList()
    if (allList.length > 0) return allList;
    else return [];
}

export async function AddList({ nameList, allList }: { nameList: string, allList: listInterface[] }) {

    /* verification de doublon */
    const doublon = allList.find((item) => TextCompare(item.name, nameList));
    if (doublon) {
        return {
            list: null,
            alert: generateAlert({
                type: "error",
                message: getTrad("listAlreadyExist"),
            })
        }
    }

    const result = await DatabaseManager.createList(nameList);

    if (result) {

        return {
            list: result,
            alert: null
        }
    }

    return {
        list: null,
        alert: generateAlert({
            type: getTrad("error"),
            message: getTrad("errorAddList"),

        }
        )
    }
}



