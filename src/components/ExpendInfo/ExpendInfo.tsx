import React, { useEffect } from "react";
import { View, Text, ImageBackground, Alert, Modal } from "react-native";
import { Icon, Image } from "@rneui/themed/";
import { IconAlimentation, IconAutres, IconLogement, IconLoisir, IconSanté, IconVetement } from "../../utils/IconCustom";
import { useSelector, useDispatch } from 'react-redux';
import { addExpend, clearExpend, listeExpendInterface, PoleExpend } from "../../redux/expendSlice";
import { ItemDeleteExpendSlice } from "../../utils/ExpendManipulation";
import { ModalAddExpend } from "../../screen/AddOperationInTheBudget/ModalAddExpend/ModalAddOperation";
import { SimpleTransactionInterface, TransactionMonthInterface } from "../../redux/comptesSlice";

interface ItemBudgetProps {


    isModalVisible: boolean,
    setIsModalVisible: (value: boolean) => void
    operation: SimpleTransactionInterface
    budget: TransactionMonthInterface

}

export function ExpendInfo({ budget, isModalVisible, setIsModalVisible, operation, }: ItemBudgetProps) {

    const [modalEditExpendVisible, setModalEditExpendVisible] = React.useState(false);

    const dispatch = useDispatch();


    function setAllModal(value: boolean) {
        setIsModalVisible(value);
        setModalEditExpendVisible(value);
    }

    if (operation === undefined || operation === null) {
        return (
            <View><Text>Expend empty</Text></View>
        );
    }

    return (

        <Modal


            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setIsModalVisible(false);
            }}

        >
            <ModalAddExpend
                isVisible={modalEditExpendVisible}
                budget={budget}
                setIsVisible={setAllModal}
                CurrentOperation={operation}


            />
            <View
                style={{

                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.2)",



                }}
            >
                <ImageBackground
                    source={require("../../assets/images/Background_recipe.png")}
                    resizeMode="contain"
                    style={{
                        height: "80%",
                        width: "100%",



                    }}

                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginTop: 20,
                        }}

                    >{operation.name}</Text>


                    <View style={{
                        backgroundColor: operation.type === "income" ? "#203EAA" : "#E1424B",

                        paddingHorizontal: 12,
                        borderRadius: 5,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "50%",
                        height: 30,
                        marginLeft: "25%",


                    }}>
                        <Text style={{ color: "#fff" }} >{operation.type === "income" ? "Depot" : "Retrait"}</Text>
                    </View>

                    <View
                        style={{

                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                                marginTop: 10,
                            }}

                        >Le</Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",

                            }}
                        >
                            {operation.date}
                        </Text>
                        <Text

                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                                marginTop: 10,
                            }}

                        >Prix unitaire : {operation.montant}€
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                                marginTop: 10,
                            }}
                        >
                            Quantité : {operation.quantity}
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                                marginTop: 10,
                            }}
                        >
                            TOTAL : {operation.total}€
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
                            style={{
                                width: "50%",
                                alignItems: "center",
                                flexDirection: "row",
                                justifyContent: "center",
                            }}
                        >
                            <Icon
                                name="delete"
                                type="material-community"
                                size={50}
                                style={{
                                    elevation: 2,
                                    marginRight: 40,
                                    backgroundColor: "#E1424B",
                                    borderRadius: 50,
                                    padding: 5,
                                }}
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



                                                }
                                            }
                                        ]
                                    );
                                }}

                            />
                            <Icon
                                name="pencil"
                                type="material-community"
                                size={50}
                                style={{
                                    elevation: 2,
                                    backgroundColor: "#203EAA",
                                    borderRadius: 50,
                                    padding: 5,
                                }}
                                color={"#fff"}
                                onPress={() => {

                                    setModalEditExpendVisible(true);
                                }}

                            />
                        </View>
                    </View>



                </ImageBackground>


            </View >

        </Modal >

    )
}