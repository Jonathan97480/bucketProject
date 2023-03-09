import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Button, Icon } from "@rneui/base";
import { useSelector, useDispatch } from "react-redux";

import { addComptes, CompteInterface } from "../../redux/comptesSlice";
import { ComptesItem } from "./components/ComptesItem/ComptesItem";
import { ModalAddCompte } from "./components/ModalAddCompte/ModalAddCompte";
import { CustomSafeAreaView } from "../../components";
import { getCompteByUser } from "./logic";
import { userInterface } from "../../redux/userSlice";
import NoCompte from "./components/NoCompte/NoCompte";
import globalStyle from "../../assets/styleSheet/globalStyle";
import { RemoveUser } from "../LoginAndRegister/logic";



export default function AllComptes({ navigation }: any) {
    const [isCompteModalVisible, setIsCompteModalVisible] = React.useState(false);

    const dispatch = useDispatch();
    const comptes: CompteInterface[] = useSelector((state: any) => state.compte.comptes);
    const user: userInterface = useSelector((state: any) => state.user);



    useEffect(() => {

        if (comptes.length <= 0) {

            getCompteByUser(user.user?.id || 1).then((comptes) => {
                console.log("COMPTES GET", comptes);
                if (comptes.length <= 0) return;

                dispatch(addComptes(comptes));

            }).catch((error) => {

                console.log(error);

            });
        }


    }, [comptes]);

    console.log("LIST DES COMPTES", comptes);
    return (
        <CustomSafeAreaView>
            <View style={
                [{ flexDirection: "row", justifyContent: "flex-end" }, globalStyle.marginVertical]
            }>
                <TouchableOpacity onPress={async () => {
                    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
                        {
                            text: "Annuler",
                            style: "cancel"
                        },
                        {
                            text: "Oui",
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
                {comptes.length <= 0 ? <NoCompte /> :
                    <ScrollView>
                        {
                            comptes.map((compte, index) => {
                                return (
                                    <ComptesItem
                                        key={index + "-compte"}
                                        id_user={user.user?.id || 1}
                                        item={{
                                            name: compte.name,
                                            montant: compte.montant,
                                            id: compte.id,
                                            date: compte.date,
                                            index: index
                                        }}
                                        navigation={navigation}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                }
                <Button
                    title="Ajouter un compte"
                    onPress={onPress}
                    buttonStyle={
                        [globalStyle.backgroundSecondaryColor]
                    }
                    radius={5}
                    icon={{
                        name: "wallet",
                        size: 20,
                        color: "white",
                        type: "material-community"
                    }}

                />
            </View>
            <ModalAddCompte
                visible={isCompteModalVisible}
                setVisible={setIsCompteModalVisible}
                id_user={user.user?.id || 1}
            />
        </CustomSafeAreaView>
    );
    function onPress() {
        setIsCompteModalVisible(true);
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