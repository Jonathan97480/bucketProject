import React from "react";
import { View, Text, Alert, Modal } from "react-native";
import { Icon } from "@rneui/themed/";
import { SimpleTransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import styleSheet from "./styleSheet";
import globalStyle from "../../../../assets/styleSheet/globalStyle";

interface ItemBudgetProps {


    isModalVisible: boolean,
    setIsModalVisible: (value: boolean) => void
    operation: SimpleTransactionInterface
    budget: TransactionMonthInterface
    callbackDeleteBtn: () => void
    callbackEditBtn: () => void
    isClosedBudget: boolean | undefined

}

export function OperationInfoModal({ budget, isModalVisible, setIsModalVisible, operation, callbackDeleteBtn, callbackEditBtn, isClosedBudget }: ItemBudgetProps) {

    return (

        <Modal


            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setIsModalVisible(false);
            }}

        >
            {operation &&
                <>
                    <View style={styleSheet.container}>
                        <View

                            style={styleSheet.backgroundRecipe}

                        >
                            <Text style={styleSheet.titleTicket}>{operation.name}</Text>


                            <View style={[
                                { backgroundColor: operation.type === "income" ? "#203EAA" : "#E1424B" },
                                styleSheet.viewTypeOperation
                            ]}>
                                <Text style={globalStyle.colorTextPrimary} >{operation.type === "income" ? "Entrée" : "Sortie"}</Text>
                            </View>

                            <View style={{ alignItems: "center", }}>

                                <Text

                                    style={[
                                        globalStyle.textAlignCenter,
                                        globalStyle.textSizeMedium,
                                        styleSheet.textInfo
                                    ]}>
                                    Prix unitaire : {operation.montant_real === 0 ? operation.montant : operation.montant_real}€
                                </Text>
                                <Text
                                    style={[
                                        globalStyle.textAlignCenter,
                                        globalStyle.textSizeMedium,
                                        styleSheet.textInfo
                                    ]}
                                >
                                    Quantité : {operation.quantity}
                                </Text>
                                <Text
                                    style={[
                                        globalStyle.textAlignCenter,
                                        globalStyle.textSizeXLarge,
                                        styleSheet.textInfo
                                    ]}
                                >
                                    TOTAL : {operation.total_real === 0 ? operation.total.toFixed(2) : operation.montant_real}€
                                </Text>

                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    width: "100%",
                                    marginTop: "10%",
                                }}
                            >
                                <View
                                    style={[
                                        styleSheet.viewRowCenter,
                                        { width: '50%' }
                                    ]}
                                >
                                    <Icon
                                        disabled={isClosedBudget}
                                        name="delete"
                                        type="material-community"
                                        size={40}

                                        style={[styleSheet.iconDeleteStyle, {
                                            backgroundColor: isClosedBudget ? "#d1d5d8" : "red"
                                        }]}
                                        color={"#fff"}
                                        onPress={() => {
                                            Alert.alert(
                                                "Suppression",
                                                `Voulez-vous vraiment supprimer ${operation.type === "income" ? "ce dépôt" : "cette dépense"} ?`,
                                                [
                                                    {
                                                        text: "Annuler",
                                                        onPress: () => { },
                                                        style: "cancel"
                                                    },
                                                    {
                                                        text: "Oui", onPress: () => {

                                                            callbackDeleteBtn();

                                                        }
                                                    }
                                                ]
                                            );
                                        }}

                                    />
                                    <Icon
                                        disabled={isClosedBudget}
                                        name="pencil"
                                        type="material-community"
                                        size={40}
                                        style={[styleSheet.iconEditStyle, {
                                            backgroundColor: isClosedBudget ? "#d1d5d8" : "#203EAA"
                                        }]}
                                        color={"#fff"}
                                        onPress={() => {


                                            callbackEditBtn();
                                        }}

                                    />
                                </View>
                            </View>



                        </View>


                    </View >
                </>
            }

        </Modal >

    )
}