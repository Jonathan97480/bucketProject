import React, { useEffect } from "react";
import { View, Text, ImageBackground, Alert, Modal } from "react-native";
import { Icon, Image } from "@rneui/themed/";
import { IconAlimentation, IconAutres, IconLogement, IconLoisir, IconSanté, IconVetement } from "../../utils/IconCustom";
import { useSelector, useDispatch } from 'react-redux';
import { addExpend, clearExpend, listeExpendInterface, PoleExpend } from "../../redux/expendSlice";
import { ItemDeleteExpendSlice } from "../../utils/ExpendManipulation";
import { ModalAddExpend } from "../ModalAddExpend/ModalAddExpend";

interface ItemBudgetProps {

    index_budget: number,
    isModalVisible: boolean,
    setIsModalVisible: (value: boolean) => void
    expend: listeExpendInterface
    id_budget: number

}

export function ExpendInfo({ index_budget, isModalVisible, setIsModalVisible, expend, id_budget }: ItemBudgetProps) {

    const [modalEditExpendVisible, setModalEditExpendVisible] = React.useState(false);

    const dispatch = useDispatch();
    const budget = useSelector((state: any) => state.expend.expends);

    function setAllModal(value: boolean) {
        setIsModalVisible(value);
        setModalEditExpendVisible(value);
    }

    if (expend === undefined || expend === null) {
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
                id_budget={id_budget}
                setIsVisible={setAllModal}
                expend={expend}
                indexBudget={index_budget}

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

                    >{expend.name}</Text>

                    <Image
                        resizeMode="contain"
                        style={{
                            width: 9,
                            height: 90,
                            marginStart: "30%",
                            marginTop: 20,

                            borderRadius: 15,
                            marginLeft: "35%",
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
                    <View style={{
                        backgroundColor: expend.type === "add" ? "#203EAA" : "#E1424B",

                        paddingHorizontal: 12,
                        borderRadius: 5,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "50%",
                        height: 30,
                        marginLeft: "25%",


                    }}>
                        <Text style={{ color: "#fff" }} >{expend.type === "add" ? "Depot" : "Retrait"}</Text>
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
                            {expend.date}
                        </Text>
                        <Text

                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                                marginTop: 10,
                            }}

                        >Prix unitaire : {expend.montant}€
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                                marginTop: 10,
                            }}
                        >
                            Quantité : {expend.quantity}
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                                marginTop: 10,
                            }}
                        >
                            TOTAL : {expend.montant_total}€
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
                                        `Voulez-vous vraiment supprimer ${expend.type === "add" ? "ce dépôt" : "cette dépense"} ?`,
                                        [
                                            {
                                                text: "Annuler",
                                                onPress: () => { },
                                                style: "cancel"
                                            },
                                            {
                                                text: "Oui", onPress: () => {
                                                    ItemDeleteExpendSlice(index_budget, expend.id, budget).then((_data) => {

                                                        dispatch(addExpend(_data));
                                                        setIsModalVisible(false);
                                                    });


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