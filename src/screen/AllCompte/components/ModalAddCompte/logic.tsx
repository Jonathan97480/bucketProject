import { CompteInterface, MonthInterface, TransactionInterface } from "../../../../redux/comptesSlice";
import DatabaseManager from "../../../../utils/DataBase";
import { getMonthByNumber } from "../../../../utils/DateManipulation";
import { generateAlert, TextCompare } from "../../../../utils/TextManipulation";
import { getTrad } from "../../../../lang/internationalization";

export const createCompte = async ({ _idUser, _nameCompte, _Overdrawn, _isOverdrawn, _AllComptes }: {
    _idUser: number,
    _nameCompte: string,
    _Overdrawn: string,
    _isOverdrawn: boolean,
    _AllComptes: CompteInterface[],
}) => {


    if (getIsCompteNameExist({
        nameCompte: _nameCompte,
        allCompte: _AllComptes
    })) return {
        compte: null,
        alert: generateAlert({
            type: "error",
            message: getTrad("compteNameExist")
        })
    }

    const newCompte = await DatabaseManager.CreateCompte({
        _idUser,
        _name: _nameCompte,
        _discovered: _isOverdrawn,
        _discoveredMontant: _Overdrawn != "" ? parseInt(_Overdrawn) : 0,
    });
    if (!newCompte) throw new Error("une erreur ces produite lors de la création du compte");


    newCompte.transactions = [];

    newCompte.transactions.push(generatedTransactionDefault({

        _AccountBalanceBeginningMonth: newCompte.pay

    }));

    newCompte.withdrawal = 0;
    newCompte.deposit = 0;
    newCompte.pay = 0;

    const compteUpdate = await DatabaseManager.UpdateCompte(
        newCompte.id,
        newCompte.name,
        newCompte.pay,
        newCompte.withdrawal,
        newCompte.deposit,
        newCompte.transactions
    );

    return {
        compte: compteUpdate,
        alert: null
    }


}


function generatedTransactionDefault({ _AccountBalanceBeginningMonth = 0 }: {

    _AccountBalanceBeginningMonth?: number,

}) {

    const curentDate = new Date();

    const monthName = getMonthByNumber(curentDate.getMonth() + 1);

    const transaction: TransactionInterface = {
        operationRecurring: {
            income: [],
            expense: []
        },
        year: curentDate.getFullYear(),
        numberTransactionYear: 0,
        month: [{
            nameMonth: monthName,
            numberTransactionMonth: 0,
            AccountBalanceBeginningMonth: _AccountBalanceBeginningMonth,
            transactions: {
                income: [],
                expense: []
            }
        }]
    }

    return transaction;

}


export async function UpdateCompte({

    oldCompte,
    nameCompte,
    Overdrawn,
    isOverdrawn,
    allCompte,

}: {
    oldCompte: CompteInterface,
    nameCompte: string,
    Overdrawn: string,
    isOverdrawn: boolean,
    allCompte: CompteInterface[],

}) {

    const newCompte: CompteInterface = JSON.parse(JSON.stringify(oldCompte));
    const newAllCompte: CompteInterface[] = JSON.parse(JSON.stringify(allCompte));

    const OverdrawnMontant = Overdrawn !== "" ? parseInt(Overdrawn) : 0;
    newCompte.name = nameCompte;
    newCompte.discovered = isOverdrawn;

    const result = await DatabaseManager.UpdateCompte(
        newCompte.id,
        newCompte.name,
        newCompte.pay,
        newCompte.withdrawal,
        newCompte.deposit,
        newCompte.transactions,
        OverdrawnMontant,
        newCompte.discovered

    );


    if (!result) throw new Error("erreur lors de la mise à jour du compte : compte non trouvé");
    /* get newCompte index in allCompte */




    return result;



}


function getIsCompteNameExist({ nameCompte, allCompte }: { nameCompte: string, allCompte: CompteInterface[] }) {

    const result = allCompte.find((compte) => TextCompare(compte.name, nameCompte));

    return result ? true : false;

}

