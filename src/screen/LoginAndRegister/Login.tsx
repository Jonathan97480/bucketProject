import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { FormValidate, LoginUser, RegisterUser, SaveUser, resetForm } from "./logic"
import { setUser } from "../../redux/userSlice"
import { getTrad } from "../../lang/internationalization"
import { CustomActivityIndicator, NotificationForm, Title } from "../../components"
import globalStyle from "../../assets/styleSheet/globalStyle"
import { View } from "react-native"
import { Button, Input } from "@rneui/base"
import { useNavigation, useRoute } from "@react-navigation/native"

export default function ScreenLoginAndRegister({ navigation, route }: { navigation: any, route: any }) {
    const { identifiant, isAsUser } = useRoute().params as { identifiant: string, isAsUser: boolean }
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [form, setForm] = useState(resetForm())

    const handleConnexionError = (error: string) => {
        setIsLoading(false)
        setIsError(true)
        setForm({
            ...form,
            errorGlobal: error
        })

    }

    useEffect(() => {

        if (identifiant) {
            setForm({
                ...form,
                identifiant: identifiant
            })
        }



    }, [identifiant, isAsUser])



    async function handleSaveUserAndNavigateScreenAllComptes(user: { id: number; identifiant: string; password: string; }) {

        dispatch(setUser(
            {
                id: user.id,
                identifiant: user.identifiant,
                password: user.password,
                isConnected: true
            }
        ))
        /* save user in local storage */
        await SaveUser({
            id: user.id,
            identifiant: user.identifiant,
            password: user.password,

        });

        setIsError(false)
        setForm({
            ...form,
            errorGlobal: getTrad("logInOk")
        })
        setTimeout(() => {
            setIsLoading(false)

            navigation.replace("AllComptes")

        }, 1000)
    }


    return (
        <>
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
                        onPress={async () => {
                            setIsLoading(true)
                            const formError = FormValidate({ identifiant: form.identifiant, password: form.password })

                            if (formError.identifiantError.length > 0 || formError.passwordError.length > 0) {
                                setForm({ ...form, ...formError })
                                setIsLoading(false)
                                return
                            }

                            if (isAsUser) {
                                const result = await LoginUser({ identifiant: form.identifiant, password: form.password })

                                if (result.user == null && result.message != null) {
                                    handleConnexionError(result.message);
                                    return;
                                }
                                if (result.user === null) {
                                    handleConnexionError(getTrad("errorConnection"));
                                    return;
                                }
                                handleSaveUserAndNavigateScreenAllComptes(result.user);

                            } else {
                                const result = await RegisterUser({ identifiant: form.identifiant, password: form.password });

                                if (result.user == null) {
                                    handleConnexionError(getTrad("errorRegister"));
                                    return;
                                }

                                handleSaveUserAndNavigateScreenAllComptes(result.user);
                            }
                        }} />
                </View>



            </View>
        </>
    )
}
