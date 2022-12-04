import React from "react";
import { View, Text, ImageBackground, Alert, Modal } from "react-native";
import { Icon, Image } from "@rneui/themed/";
import { IconAlimentation, IconAutres, IconLogement, IconLoisir, IconSanté, IconVetement } from "../utils/IconCustom";
import { useSelector, useDispatch } from 'react-redux';
import { addExpend, PoleExpend } from "../redux/expendSlice";
import { ItemDeleteExpendSlice } from "../utils/ExpendManipulation";

interface ItemBudgetProps {
    date: string,
    name_category: string,
    montant: number,
    title: string,
    type: string,
    index_budget: number,
    id_expend: number,
    isModalVisible: boolean,
    setIsModalVisible: (value: boolean) => void
}

export function ExpendInfo({ name_category, montant, title, type, date, index_budget, id_expend, isModalVisible, setIsModalVisible }: ItemBudgetProps) {

    const dispatch = useDispatch();
    const budget = useSelector((state: any) => state.expend.expends);

    return (
        <Modal

            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setIsModalVisible(false);
            }}

        >
            <View
                style={{

                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.2)",



                }}
            >
                <ImageBackground
                    source={require("../screen/images/Background_recipe.png")}
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

                    >{title}</Text>

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
                            name_category === "Alimentation" ? IconAlimentation :
                                name_category === "Loisirs" ? IconLoisir :
                                    name_category === "Santé" ? IconSanté :
                                        name_category === "Vêtements" ? IconVetement :
                                            name_category === "Logement" ? IconLogement :
                                                IconAutres
                        }
                    />
                    <View style={{
                        backgroundColor: type === "add" ? "#203EAA" : "#E1424B",

                        paddingHorizontal: 12,
                        borderRadius: 5,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "50%",
                        height: 30,
                        marginLeft: "25%",


                    }}>
                        <Text style={{ color: "#fff" }} >{type === "add" ? "Depot" : "Retrait"}</Text>
                    </View>
                    <Text

                        style={{
                            fontSize: 40,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginTop: 0,
                        }}

                    >{montant}€
                    </Text>
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
                                marginTop: 20,
                            }}

                        >Le</Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",

                            }}
                        >
                            {date}
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
                        <Icon
                            name="delete"
                            type="material-community"
                            size={50}
                            style={{
                                elevation: 5,
                            }}
                            color={"#E1424B"}
                            onPress={() => {
                                Alert.alert(
                                    "Suppression",
                                    `Voulez-vous vraiment supprimer ${type === "add" ? "ce dépôt" : "cette dépense"} ?`,
                                    [
                                        {
                                            text: "Annuler",
                                            onPress: () => { },
                                            style: "cancel"
                                        },
                                        {
                                            text: "Oui", onPress: () => {
                                                ItemDeleteExpendSlice(index_budget, id_expend, budget).then((_data: PoleExpend[]) => {
                                                    setIsModalVisible(false);
                                                    dispatch(addExpend(_data));
                                                });
                                                setIsModalVisible(false);

                                            }
                                        }
                                    ]
                                );
                            }}

                        />
                    </View>

                </ImageBackground>


            </View >
        </Modal >

    )
}