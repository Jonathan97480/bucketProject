import { CompteInterface } from "../../redux/comptesSlice";
import DatabaseManager from "../../utils/DataBase"

export const getCompteByUser = async (id: number) => {

    const arrayIDuserAndIDCompte = await DatabaseManager.GetIDComptesByIDUser(id)


    if (arrayIDuserAndIDCompte.length <= 0) return [] as CompteInterface[];

    const arrayIDCompte: number[] = [];

    arrayIDuserAndIDCompte.forEach((idUserAndIDCompte) => {

        arrayIDCompte.push(idUserAndIDCompte.compte_id);

    })

    const comptes = await DatabaseManager.GetAllComptesByListID(arrayIDCompte)

    return comptes;


}