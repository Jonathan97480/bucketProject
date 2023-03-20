import { listInterface } from "../../redux/listSlice";
import DatabaseManager from "../../utils/DataBase";
import { CreateDateCurentString } from "../../utils/TextManipulation";


export async function addTask({ value, list }: { value: string, list: listInterface }) {

    let newItemArray = [...list.steps];
    newItemArray.push({
        id: 0,
        name: value,
        quantity: 0,
        isChecked: false,
        date: CreateDateCurentString(),
        montant: 0,
        category: "autre",
        type: "achat",
    });

    const AllList = await UpdateList({
        isChecked: false,
        id: newItemArray.length - 1,
        ItemArray: newItemArray,
        list: list
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





