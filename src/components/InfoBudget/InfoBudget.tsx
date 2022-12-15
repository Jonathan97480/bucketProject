import { Button } from "@rneui/base";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Modal } from "react-native";
import { PoleExpend } from "../../redux/expendSlice";
import { addList, addListArray, listInterface } from "../../redux/listSlice";
import DatabaseManager from "../../utils/DataBase";
import { ItemBudget } from "../ItemBudget/ItemBudget";
import { useDispatch, useSelector } from 'react-redux';


interface InfoModalProps {
    setIsViewModalInfo: (value: boolean) => void,
    IsViewModalInfo: boolean,
    budget: PoleExpend,
    indexBudget: number,
}


export const InfoModal = ({ setIsViewModalInfo, IsViewModalInfo, budget, indexBudget }: InfoModalProps) => {

    const dispatch = useDispatch();
    const AllList: listInterface[] = useSelector((state: any) => state.list.list);
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
                    >MONTANT DU BUDGET</Text>
                    <Text
                        style={styles.textInfo}
                    >{budget.montantStart}€</Text>
                </View>


                <View
                    style={styles.containInfo2}
                >
                    <Text
                        style={styles.textInfo}
                    >DÉPENSE DU BUDGET</Text>
                </View>

                <ScrollView
                    style={{
                        width: "100%",
                        maxHeight: "100%",
                    }}
                >
                    {
                        budget.listeExpend.map((item, index) => {
                            return (
                                <ItemBudget
                                    key={item.id + index}
                                    indexBudget={indexBudget}
                                    expend={item}
                                    idBudget={budget.id}
                                />
                            )
                        })
                    }



                </ScrollView>


                <View
                    style={styles.blockRest}
                >
                    <Text
                        style={styles.textInfo}
                    >Reste du budget</Text>
                    <Text
                        style={styles.textInfo}
                    >{budget.montant}€</Text>
                </View>

                <Button
                    title="Créer une liste"
                    onPress={() => {

                        DatabaseManager.createListByBudget(budget).then((data: listInterface) => {


                            dispatch(addListArray(data));

                        });

                        setIsViewModalInfo(false);
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
