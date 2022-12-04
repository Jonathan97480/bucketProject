import React from "react";
import { View, Text, StyleSheet, ScrollView, Modal } from "react-native";
import { PoleExpend } from "../redux/expendSlice";
import { ItemBudget } from "./ItemBudget";


interface InfoModalProps {
    setIsViewModalInfo: (value: boolean) => void,
    IsViewModalInfo: boolean,
    budget: PoleExpend,
    indexBudget: number,
}


export const InfoModal = ({ setIsViewModalInfo, IsViewModalInfo, budget, indexBudget }: InfoModalProps) => {
    console.log("BUGET GET TEXT", budget);

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
                                    title={item.name}
                                    montant={item.montant}
                                    id_expend={item.id} name_category={item.category}
                                    ItemDeleteExpendSlice={undefined}
                                    indexBudget={indexBudget}
                                    type={item.type}
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
