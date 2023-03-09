import DatabaseManager from "../../../../utils/DataBase";

export const creteCompte = async ({ idUser, nameCompte }: {
    idUser: number,
    nameCompte: string,
}) => {

    const result = await DatabaseManager.CreateCompte({
        idUser,
        name: nameCompte
    });

    if (result) {
        return result;
    } else {
        throw new Error("erreur lors de la création du compte");
    }



}