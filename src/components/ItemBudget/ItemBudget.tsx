import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { textSizeFixe } from "../../utils/TextManipulation";
import { ExpendInfo } from "../ExpendInfo/ExpendInfo";
import { useDispatch } from 'react-redux';
import { SimpleTransactionInterface, TransactionMonthInterface } from "../../redux/comptesSlice";
import globalStyle from "../../assets/styleSheet/globalStyle";




interface ItemBudgetProps {

    operation: SimpleTransactionInterface
    budget: TransactionMonthInterface
}


export const ItemBudget = ({ operation, budget }: ItemBudgetProps) => {

    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();


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
                                /* DatabaseManager.deleteExpend(expend.id).then(() => {

                                    ItemDeleteExpendSlice(indexBudget, expend.id, budget).then((newBudget) => {

                                        dispatch(addExpend(newBudget));

                                    }).catch((error) => {

                                        console.log(error);

                                    });
                                }); */
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
                    style={[{ width: "45%", }, globalStyle.colorTextPrimary]}

                >{textSizeFixe(operation.name, 17)}</Text>
                <Text style={[globalStyle.colorTextPrimary]} >{operation.montant}€</Text>
                <View style={[{ backgroundColor: operation.type === "income" ? "#203EAA" : "#E1424B", }, styles.pastille]}>
                    <Text style={{ color: "#fff" }} >{operation.type === "income" ? "Depot" : "Retrait"}</Text>
                </View>

                <ExpendInfo
                    isModalVisible={modalVisible}
                    setIsModalVisible={setModalVisible}
                    operation={operation}
                    budget={budget}


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
        borderColor: "#E5E5E5",
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