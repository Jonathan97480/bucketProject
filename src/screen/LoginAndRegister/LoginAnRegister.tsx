import { Button, Input } from "@rneui/base";
import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { FormValidate, GetUser, LoginUser, RegisterUser, SaveUser } from "./logic";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Title, CustomSafeAreaView, CustomActivityIndicator } from "../../components";
import DatabaseManager from "../../utils/DataBase";
import { setUser, userInterface } from "../../redux/userSlice";
import globalStyle from "../../assets/styleSheet/globalStyle";
import styleSheet from "./styleSheet";


export default function LoginAndRegister({ navigation }: any) {

    const dispatch = useDispatch()
    const [isAsUser, setIsAsUser] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const [form, setForm] = useState({
        identifiant: "",
        identifiantError: "",
        password: "",
        passwordError: "",
        errorGlobal: ""
    })


    useEffect(() => {

        DatabaseManager.GetIsAsUser().then((isAsUser) => {

            if (isAsUser) {

                GetUser().then((user) => {

                    if (typeof user !== "boolean") {



                        dispatch(setUser(user))
                        navigation.replace("AllComptes")

                    } else {
                        setIsAsUser(isAsUser)
                    }

                }).catch((error) => {

                    console.error(error)
                })
            }
            setIsAsUser(isAsUser)


        }).catch((error) => {
            console.error(error)
        })



    }, [])




    return (
        <CustomSafeAreaView>

            <Title title={isAsUser ? "Ce connectée" : "Crée un compte"} />

            <View style={globalStyle.containerCenter} >
                {
                    form.errorGlobal !== "" && form.errorGlobal.length > 0 ?
                        <View
                            style={[isError ? globalStyle.backgroundErrorColor : globalStyle.backgroundSuccessColor, styleSheet.containerMessageForm]}
                        >
                            <Text
                                style={[globalStyle.colorTextPrimary, globalStyle.textSizeSmall, globalStyle.textAlignCenter]}
                            >{form.errorGlobal}</Text>
                        </View> : null}
                <View>
                    {
                        isLoading &&
                        <CustomActivityIndicator />
                    }
                    <Input
                        style={globalStyle.marginVertical}
                        inputStyle={globalStyle.inputStyle}
                        placeholder="Votre identifiant"
                        label="Identifiant"
                        errorMessage={form.identifiantError}
                        value={form.identifiant}
                        onChangeText={(text) => setForm({ ...form, identifiant: text })}

                    />

                    <Input
                        style={globalStyle.marginVertical}
                        inputStyle={globalStyle.inputStyle}
                        placeholder="Votre mot de passe"
                        label="Mot de passe"
                        errorMessage={form.passwordError}
                        value={form.password}
                        secureTextEntry={true}
                        onChangeText={(text) => setForm({ ...form, password: text })}

                    />

                    <Button
                        style={globalStyle.marginVertical}
                        radius={25}
                        buttonStyle={globalStyle.btnStyle}
                        title={isAsUser ? "Se connecter" : "Crée mon compte"}
                        onPress={() => {
                            setIsLoading(true)
                            const formError = FormValidate({
                                identifiant: form.identifiant,
                                password: form.password
                            })

                            if (formError.identifiantError.length > 0 || formError.passwordError.length > 0) {
                                setForm({ ...form, ...formError })
                                setIsLoading(false)
                                return
                            }

                            if (isAsUser) {

                                LoginUser({

                                    identifiant: form.identifiant,
                                    password: form.password

                                }).then((result) => {

                                    if (typeof result === "object") {

                                        dispatch(setUser(
                                            {
                                                id: result.id,
                                                identifiant: result.identifiant,
                                                password: result.password,
                                                isConnected: true
                                            }
                                        ))

                                        /* save user in local storage */
                                        SaveUser({
                                            id: result.id,
                                            identifiant: result.identifiant,
                                            password: result.password,

                                        }).then(() => {

                                            setIsError(false)
                                            setForm({
                                                ...form,
                                                errorGlobal: "Vous êtes connecté avec succès vous allez être redirigé vers la page des comptes"
                                            })
                                            setTimeout(() => {
                                                setIsLoading(false)

                                                navigation.replace("AllComptes")

                                            }, 3000)
                                        }).catch((error) => {
                                            setIsLoading(false)
                                            console.error(error)
                                        })
                                    } else {
                                        setIsLoading(false)
                                        setIsError(true)
                                        setForm({
                                            ...form,
                                            errorGlobal: result
                                        })
                                        console.error(result)
                                    }

                                }).catch((error) => {
                                    setIsLoading(false)
                                    console.error(error)
                                })

                            } else {
                                RegisterUser({

                                    identifiant: form.identifiant,
                                    password: form.password

                                }).then((result) => {

                                    if (result !== undefined) {

                                        dispatch(setUser(
                                            {
                                                id: result.id,
                                                identifiant: result.identifiant,
                                                password: result.password,
                                                isConnected: true
                                            }
                                        ))
                                        /* save user in local storage */
                                        SaveUser({
                                            id: result.id,
                                            identifiant: result.identifiant,
                                            password: result.password,

                                        }).then(() => {

                                            setIsError(false)
                                            setForm({
                                                ...form,
                                                errorGlobal: "Vous êtes connecté avec succès vous allez être redirigé vers la page des comptes"
                                            })
                                            setTimeout(() => {
                                                setIsLoading(false)

                                                navigation.replace("AllComptes")

                                            }, 3000)

                                        }).catch((error) => {
                                            setIsLoading(false)
                                            console.error(error)
                                        })


                                    }



                                }).catch((error) => {
                                    setIsLoading(false)
                                    console.error(error)
                                })

                            }


                        }} />
                </View>



            </View>


        </CustomSafeAreaView>
    )



}

