import AsyncStorage from '@react-native-async-storage/async-storage';
import DatabaseManager from "../../utils/DataBase"

interface FormValidateParams {
    identifiant: string,
    password: string
}
export const FormValidate = ({ identifiant, password }: FormValidateParams) => {

    let formError = {
        identifiantError: "",
        passwordError: "",
    }

    if (identifiant.length < 3) {
        formError.identifiantError = "L'identifiant doit contenir au moins 3 caractères"
    }
    if (password.length < 4) {
        formError.passwordError = "Le mot de passe doit contenir au moins 3 caractères"
    }
    return formError

}

export const RegisterUser = async ({ identifiant, password }: FormValidateParams) => {



    const result = await DatabaseManager.RegisterUser(identifiant, password)

    if (result) {
        const _result = await LoginUser({ identifiant, password })
        if (typeof _result === "object")
            return _result
        else
            throw new Error(_result)

    }


}


export const LoginUser = async ({ identifiant, password }: FormValidateParams): Promise<"l'utilisateur n'existe pas" | {
    id: number,
    identifiant: string,
    password: string,
}> => {


    const result = await DatabaseManager.LoginUser(identifiant, password)


    if (typeof result === "boolean")
        return "l'utilisateur n'existe pas"

    return result


}

/* save user in local storage mobile */
export const SaveUser = async (user: {
    id: number,
    identifiant: string,
    password: string,

}) => {

    try {
        await AsyncStorage.setItem("user", JSON.stringify(user))
    } catch (e) {
        console.error(e)
    }

}

/* get user from local storage mobile */
export const GetUser = async (): Promise<
    {
        id: number,
        identifiant: string,
        password: string,
    } | boolean
> => {

    try {
        const value = await AsyncStorage.getItem("user")
        if (value !== null) {
            return JSON.parse(value)
        }

    } catch (e) {
        console.error(e)
    }
    return false
}

/* remove user from local storage mobile */
export const RemoveUser = async () => {

    try {
        await AsyncStorage.removeItem("user")
    } catch (e) {
        console.error(e)
    }

}

