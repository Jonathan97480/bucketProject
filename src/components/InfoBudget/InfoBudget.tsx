import { Button, Icon } from "@rneui/base";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Modal } from "react-native";
import { PoleExpend } from "../../redux/expendSlice";
import { addList, addListArray, listInterface } from "../../redux/listSlice";
import DatabaseManager from "../../utils/DataBase";
import { ItemBudget } from "../ItemBudget/ItemBudget";
import { useDispatch, useSelector } from 'react-redux';


interface InfoModalProps {
    setIsViewModalInfo: (value: boolean) => void,
    editBudget: () => void,
    IsViewModalInfo: boolean,
    budget: PoleExpend,
    indexBudget: number,
}


export const InfoModal = ({ setIsViewModalInfo, IsViewModalInfo, budget, indexBudget, editBudget }: InfoModalProps) => {

    const dispatch = useDispatch();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={IsViewModalInfo}
            style={styles.modal}
            onRequestClose={() => {
                setIsViewModalInfo(false);
            }}
        >
            <View style={styles.contain}
            >

                <Text

                    style={styles.budgetTitle}
                >{budget.nom}</Text>
                <View
                    style={styles.containInfo}
                >
                    <Text
                        style={styles.textInfo}
                    >MONTANT DEPART DU BUDGET</Text>
                    <Text
                        style={styles.textInfo}
                    >{budget.montantStart}€</Text>

                    <Text
                        style={styles.textInfo}
                    >MONTANT RESTANT DU BUDGET</Text>
                    <Text
                        style={styles.textInfo}
                    >{budget.montant}€</Text>

                </View>



                <Button
                    disabled={budget.listeExpend.length <= 0}
                    containerStyle={{ width: "80%", marginBottom: 20, borderRadius: 10 }}
                    icon={
                        <Icon
                            containerStyle={{ marginRight: 10 }}
                            name="list"
                            size={20}
                            color="white"
                        />
                    }
                    title="Créer une liste"
                    onPress={() => {

                        DatabaseManager.createListByBudget(budget).then((data: listInterface) => {


                            dispatch(addListArray(data));

                        });

                        setIsViewModalInfo(false);
                    }}
                />
                <Button
                    containerStyle={{ width: "80%", marginBottom: 20, borderRadius: 10 }}

                    icon={
                        <Icon
                            containerStyle={{ marginRight: 10 }}
                            name="edit"
                            size={20}
                            color="white"


                        />
                    }
                    title="Éditer le budget"
                    onPress={() => {
                        setIsViewModalInfo(false);
                        editBudget();
                    }}
                />

            </View>
        </Modal >

    )


}

const styles = StyleSheet.create({
    modal: {

        maxHeight: '100%',
    },
    contain: {

        flex: 1,
        alignItems: 'center',
        minHeight: '100%',
        maxWidth: '100%',
        backgroundColor: "#fff"

    }, budgetTitle: {

        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20

    }, containInfo: {
        width: "100%",
        backgroundColor: "blue",
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }, textInfo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "#fff"

    }, containInfo2: {


        backgroundColor: "#000",
        width: "100%",


    }, blockRest: {

        width: "100%",
        height: 100,
        backgroundColor: "blue",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    }


})
