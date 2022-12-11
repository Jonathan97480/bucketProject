
import { PoleExpend } from "../redux/expendSlice";
import DatabaseManager from "./DataBase";

export function getAllExpend(): Promise<PoleExpend[]> {


    return new Promise((resolve, reject) => {

        DatabaseManager.getBudget().then((data: any) => {
            const newPoleExpends: PoleExpend[] = [];

            for (let index = 0; index < data.length; index++) {
                const pole = data[index];
                newPoleExpends.push({
                    id: pole.id,
                    nom: pole.name,
                    montant: pole.montant,
                    date: pole.date,
                    montantStart: pole.start_montant,
                    isList: pole.is_list == 1 ? true : false,
                    listeExpend: []
                });

            }

            getExpend(newPoleExpends).then((_data: PoleExpend[]) => {

                resolve(_data);

            });

        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });

}

async function getExpend(data: PoleExpend[]) {

    if (data.length <= 0) {
        return data;
    }
    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        await DatabaseManager.getExpensesByBudget(element.id).then((_data) => {

            data[i].listeExpend = _data;

        });

    }

    return data;

}