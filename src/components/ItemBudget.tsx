import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"; import DatabaseManager from "../utils/DataBase";
import { textSizeFixe } from "../utils/TextManipulation";
import { Image } from "@rneui/themed/";
import { IconAlimentation, IconAutres, IconLogement, IconLoisir, IconSanté, IconVetement } from "../utils/IconCustom";
import { ExpendInfo } from "./ExpendInfo";
import { ItemDeleteExpendSlice } from "../utils/ExpendManipulation";
import { useSelector, useDispatch } from 'react-redux';
import { addExpend, listeExpendInterface, PoleExpend } from "../redux/expendSlice";




interface ItemBudgetProps {

    indexBudget: number,
    expend: listeExpendInterface
    idBudget: number
}


export const ItemBudget = ({ indexBudget, expend, idBudget }: ItemBudgetProps) => {

    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const budget: PoleExpend[] = useSelector((state: any) => state.expend.expends);

    return (
        <TouchableOpacity style={{ marginBottom: 20 }}
            onLongPress={() => {

                Alert.alert(
                    "Supprimer",
                    "Voulez-vous supprimer cette dépense ?",
                    [
                        {
                            text: "Annuler",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: "OK", onPress: () => {
                                DatabaseManager.deleteExpend(expend.id).then(() => {

                                    ItemDeleteExpendSlice(indexBudget, expend.id, budget).then((newBudget: PoleExpend[]) => {

                                        dispatch(addExpend(newBudget));

                                    }).catch((error) => {

                                        console.log(error);

                                    });
                                });
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }}
            onPress={() => {
                setModalVisible(true);
            }}>
            <View style={styles.itemBudget}>
                <Text
                    style={{
                        width: "45%",
                    }}

                >{textSizeFixe(expend.name, 17)}</Text>
                <Text>{expend.montant_total}€</Text>
                <View style={[{ backgroundColor: expend.type === "add" ? "#203EAA" : "#E1424B", }, styles.pastille]}>
                    <Text style={{ color: "#fff" }} >{expend.type === "add" ? "Depot" : "Retrait"}</Text>
                </View>
                <Image
                    resizeMode="cover"
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        marginLeft: 10
                    }}
                    source={
                        expend.category === "Alimentation" ? IconAlimentation :
                            expend.category === "Loisirs" ? IconLoisir :
                                expend.category === "Santé" ? IconSanté :
                                    expend.category === "Vêtements" ? IconVetement :
                                        expend.category === "Logement" ? IconLogement :
                                            IconAutres
                    }
                />
                <ExpendInfo
                    isModalVisible={modalVisible}
                    setIsModalVisible={setModalVisible}
                    expend={expend}
                    index_budget={indexBudget}
                    id_budget={idBudget}

                />
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({

    itemBudget: {

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: "rgba(0,0,0,0.72)",
        borderBottomWidth: 2,
        paddingBottom: 13,
        paddingHorizontal: 20,

    }, pastille: {

        padding: 1,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    }
});