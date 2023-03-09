import DatabaseManager from "../../../../utils/DataBase";

export const deleteCompte = async ({ id_compte, id_user }: {
    id_compte: number,
    id_user: number,
}) => {


    const result = await DatabaseManager.DeleteCompteById(id_compte, id_user);
    console.log("Test result", result);
    if (result) {
        return result;
    } else {
        throw new Error("erreur lors de la suppression du compte");
    }

}