import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"; import DatabaseManager from "../utils/DataBase";
import { textSizeFixe } from "../utils/TextManipulation";
import { Image } from "@rneui/themed/";
import { IconAlimentation, IconAutres, IconLogement, IconLoisir, IconSanté, IconVetement } from "../utils/IconCustom";
import { ExpendInfo } from "./ExpendInfo";
import { ItemDeleteExpendSlice } from "../utils/ExpendManipulation";
import { useSelector, useDispatch } from 'react-redux';
import { addExpend, PoleExpend } from "../redux/expendSlice";




interface ItemBudgetProps {
    title: string,
    montant: number,
    id_expend: number,
    name_category: string,
    indexBudget: number,
    type: string
}


export const ItemBudget = ({ title, montant, id_expend, name_category, indexBudget, type }: ItemBudgetProps) => {

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
                                DatabaseManager.deleteExpend(id_expend).then(() => {

                                    ItemDeleteExpendSlice(indexBudget, id_expend, budget).then((newBudget: PoleExpend[]) => {

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

                >{textSizeFixe(title, 17)}</Text>
                <Text>{montant}€</Text>
                <View style={[{ backgroundColor: type === "add" ? "#203EAA" : "#E1424B", }, styles.pastille]}>
                    <Text style={{ color: "#fff" }} >{type === "add" ? "Depot" : "Retrait"}</Text>
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
                        name_category === "Alimentation" ? IconAlimentation :
                            name_category === "Loisirs" ? IconLoisir :
                                name_category === "Santé" ? IconSanté :
                                    name_category === "Vêtements" ? IconVetement :
                                        name_category === "Logement" ? IconLogement :
                                            IconAutres
                    }
                />
                <ExpendInfo date={"12/20/2022"} name_category={name_category} montant={montant} title={title} type={type}
                    isModalVisible={modalVisible} setIsModalVisible={setModalVisible}
                    index_budget={indexBudget}
                    id_expend={id_expend}
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