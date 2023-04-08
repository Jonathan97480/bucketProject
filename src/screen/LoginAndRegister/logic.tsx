import AsyncStorage from '@react-native-async-storage/async-storage';
import DatabaseManager from "../../utils/DataBase"
import { getTrad } from '../../lang/internationalization';

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

export const resetForm = () => {
    return {
        identifiant: "",
        identifiantError: "",
        password: "",
        passwordError: "",
        errorGlobal: ""
    }
}

export const RegisterUser = async ({ identifiant, password }: FormValidateParams) => {

    const result = await DatabaseManager.RegisterUser(identifiant, password)

    if (result) {
        const _result = await LoginUser({ identifiant, password });
        if (typeof _result.user != null) return _result;

        return {
            user: null,
            message: getTrad("AnErrorOccurredRegisteringNewUser")
        }

    }

    return {
        user: null,
        message: getTrad("AnErrorOccurredRegisteringNewUser")
    }

}


export const LoginUser = async ({ identifiant, password }: FormValidateParams): Promise<{
    user: {
        id: number,
        identifiant: string,
        password: string,
    } | null,
    message: string | null
}> => {


    const result = await DatabaseManager.LoginUser(identifiant, password)


    if (typeof result === "boolean")
        return {
            user: null,
            message: getTrad("TheUserDoesNotExist")
        }

    return {
        user: result,
        message: null
    }


}

/* save user in local storage mobile */
export const SaveUser = async (user: {
    id: number,
    identifiant: string,
    password: string,

}) => {

    try {
        await AsyncStorage.setItem("user", JSON.stringify(user))

        return {
            user: user,
            message: getTrad("TheUserRegisteredSuccessfully")
        }

    } catch (e) {
        return {
            user: null,
            message: getTrad("UserCouldNotSaved")
        }
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

export const GetIsAsUser = async () => {

    const result: boolean = await DatabaseManager.GetIsAsUser();

    if (result) {

        const user = await GetUser();

        if (typeof user === "object") {
            return {
                isUserRegister: true,
                userAutoLogin: true,
                user: user
            }
        }
        return {
            isUserRegister: true,
            userAutoLogin: false,
            user: null
        }
    }

    return {
        isUserRegister: false,
        userAutoLogin: false,
        user: null
    }

}


export const GetAllUser = async () => {
    const result = await DatabaseManager.GetAllUsers();
    return {
        isUserRegister: false,
        userAutoLogin: false,
        users: result
    };
}


export const RemoveUserInDatabase = async (id_user: number) => {

    const result = await DatabaseManager.RemoveUser(id_user);

    if (result) {
        return {
            isRemove: true,
            message: getTrad("TheUserHasBeenDeleted")
        }
    }

    return {
        isRemove: false,
        message: getTrad("AnErrorOccurredDeletingTheUser")


    }
}