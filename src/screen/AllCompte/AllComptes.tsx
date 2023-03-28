import React, { useEffect, useReducer, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from "react-native";
import { Button, Icon } from "@rneui/base";
import { useSelector, useDispatch } from "react-redux";
import { CustomActivityIndicator } from "../../components";
import { addComptes, CompteInterface, deleteCompteArray } from "../../redux/comptesSlice";
import { ComptesItem } from "./components/ComptesItem/ComptesItem";
import { ModalAddCompte } from "./components/ModalAddCompte/ModalAddCompte";
import { CustomSafeAreaView } from "../../components";
import { getCompteByUser } from "./logic";
import { userInterface } from "../../redux/userSlice";
import NoCompte from "./components/NoCompte/NoCompte";
import globalStyle from "../../assets/styleSheet/globalStyle";
import { RemoveUser } from "../LoginAndRegister/logic";
import { deleteCompte } from "./components/ComptesItem/logic";
import { getLocales } from 'expo-localization';
import { trad, getTrad } from "../../lang/internationalization";


export default function AllComptes({ navigation }: any) {

    const local: "FR" | "EN" = getLocales()[0].languageCode === "fr" ? "FR" : "EN";

    const [curentCompte, setCurentCompte] = useState<CompteInterface | null>(null);
    function ModalAddCompteReducer(state: any, action: { type: string, payload?: CompteInterface }) {
        switch (action.type) {
            case 'add':
                setCurentCompte(null);
                return {
                    ...state,
                    isCompteModalVisible: true
                };


            case 'edit':
                setCurentCompte(action.payload!);
                return {
                    ...state,
                    isCompteModalVisible: true
                };

            case 'close':
                setCurentCompte(null);
                return {
                    ...state,
                    isCompteModalVisible: false
                };
            default:
                return state;
        }
    }

    const [isCompteModalVisible, setIsCompteModalVisible] = useReducer(ModalAddCompteReducer, { isCompteModalVisible: false });
    const [isLoading, setIsLoading] = useState(false);


    const dispatch = useDispatch();
    const comptes: CompteInterface[] = useSelector((state: any) => state.compte.comptes);
    const user: userInterface = useSelector((state: any) => state.user);



    useEffect(() => {

        if (comptes.length <= 0) {

            getCompteByUser(user.user?.id || 1).then((comptes) => {

                if (comptes.length <= 0) return;

                dispatch(addComptes(comptes));

            }).catch((error) => {

                console.log(error);

            });
        }


    }, [comptes]);


    const handleDelete = (id: number, id_user: number) => {


        Alert.alert(
            trad[local].deleteCompte,
            trad[local].deleteCompteMessage,
            [
                {
                    text: trad[local].cancel,
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: trad[local].yes,
                    onPress: async () => {
                        {
                            setIsLoading(true);

                            await deleteCompte({

                                id_user: id_user,
                                id_compte: id

                            })

                            setTimeout(() => {

                                setIsLoading(false);
                                dispatch(deleteCompteArray(id))

                            }, 500);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };


    return (
        <CustomSafeAreaView>
            <View style={
                [{ flexDirection: "row", justifyContent: "flex-end" }, globalStyle.marginVertical]
            }>

                <TouchableOpacity onPress={async () => {
                    Alert.alert(trad[local].logout,
                        trad[local].logoutUser, [
                        {
                            text: trad[local].cancel,
                            style: "cancel"
                        },
                        {
                            text: trad[local].yes,
                            onPress: async () => {

                                await RemoveUser()
                                navigation.navigate("LoginAndRegister");
                            }
                        }
                    ]);
                }}
                    style={{
                        backgroundColor: "#8280E5",
                        padding: 8,
                        borderRadius: 50,

                    }}
                >

                    <Icon
                        name="logout"
                        type="material-community"
                        size={30}
                        color="#F13232"
                    />

                </TouchableOpacity>
            </View>

            <View style={globalStyle.containerCenter} >
                {comptes.length <= 0 ? <NoCompte
                    trad={trad[local]}
                /> :
                    <FlatList
                        data={comptes}
                        renderItem={({ item }) => (
                            <ComptesItem

                                item={item}
                                navigation={navigation}
                                editCallBack={(item) => {
                                    setIsCompteModalVisible({
                                        type: "edit",
                                        payload: item
                                    });
                                }}
                                deleteCallBack={(id) => {
                                    handleDelete(id, user.user?.id || 1)
                                }}

                            />
                        )}
                        keyExtractor={item => item.id.toString()}
                    />



                }
                <Button
                    title={getTrad("AddAnAccount")}
                    onPress={onPress}
                    buttonStyle={globalStyle.btnStyle}
                    radius={25}
                    icon={{
                        name: "wallet",
                        size: 20,
                        color: "white",
                        type: "material-community"
                    }}

                />
            </View>
            <ModalAddCompte
                visible={isCompteModalVisible.isCompteModalVisible}
                setVisible={() => setIsCompteModalVisible({
                    type: "close"

                })}
                id_user={user.user?.id || 1}
                allComptes={comptes}
                curentCompte={curentCompte}
                trad={trad[local]}
            />
            {isLoading &&
                <CustomActivityIndicator />}
        </CustomSafeAreaView>
    );
    function onPress() {
        setIsCompteModalVisible({
            type: "add"
        });
    }
}







const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100%",
        height: "100%",
        paddingBottom: 20,
    },
    text: {
        fontSize: 30,
    },
});