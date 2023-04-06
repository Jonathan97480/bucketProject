import { Button, Input } from "@rneui/base";
import React, { useState, useEffect } from "react";
import { FormValidate, GetIsAsUser, LoginUser, RegisterUser, SaveUser } from "./logic";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { Title, CustomSafeAreaView, CustomActivityIndicator, NotificationForm } from "../../components";
import { setUser } from "../../redux/userSlice";
import globalStyle from "../../assets/styleSheet/globalStyle";
import { getTrad } from "../../lang/internationalization";

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
        GetIsAsUserCallBack();
    }, [])

    const GetIsAsUserCallBack = React.useCallback(async () => {
        const result = await GetIsAsUser()

        if (result.isUserRegister) {
            setIsAsUser(true)
        }

        if (result.userAutoLogin && result.user !== null) {

            const user = result.user;

            if (typeof user === "object") {

                dispatch(setUser(user));
                navigation.replace("AllComptes");

            }
        }
    }, [])


    return (
        <CustomSafeAreaView>

            <Title title={isAsUser ? getTrad("ToLogIn") : getTrad("CreateAccount")} />

            <View style={globalStyle.containerCenter} >
                <NotificationForm message={form.errorGlobal} type={isError ? "error" : "success"} messageDefault={isAsUser ? getTrad("pleaseConnectYour") : getTrad("EmptyUserCreateYourCount")} />
                <View style={
                    globalStyle.containerForm
                }>
                    {
                        isLoading &&
                        <CustomActivityIndicator />
                    }
                    <Input

                        inputStyle={globalStyle.inputStyle}
                        placeholder={getTrad("YourUsername")}
                        labelStyle={globalStyle.labelStyle}
                        label={getTrad("Username")}
                        errorMessage={form.identifiantError}
                        value={form.identifiant}
                        onChangeText={(text) => setForm({ ...form, identifiant: text })}
                        inputContainerStyle={globalStyle.inputContainerStyle}
                    />

                    <Input
                        labelStyle={globalStyle.labelStyle}
                        inputStyle={globalStyle.inputStyle}
                        placeholder={getTrad("YourPassword")}
                        label={getTrad("Password")}
                        errorMessage={form.passwordError}
                        inputContainerStyle={globalStyle.inputContainerStyle}
                        value={form.password}
                        secureTextEntry={true}
                        onChangeText={(text) => setForm({ ...form, password: text })}

                    />

                    <Button
                        style={globalStyle.marginVertical}
                        radius={25}
                        buttonStyle={globalStyle.btnStyle}
                        title={isAsUser ? getTrad("ToLogIn") : getTrad("CreateAccount")}
                        titleStyle={globalStyle.btnTitleStyle}
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
                                                errorGlobal: getTrad("logInOk")
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
                                                errorGlobal: getTrad("registerOk")
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

