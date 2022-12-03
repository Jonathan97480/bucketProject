import React, { useState } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import { Input, Button } from "@rneui/themed/";
import { Picker } from '@react-native-picker/picker';
import DatabaseManager from "../utils/DataBase";
import { listeExpendInterface } from "../redux/expendSlice";

export const ModalAddExpend = ({ isVisible, id_budget, setIsVisible, ItemAddExpendSlice, indexBudget }: { isVisible: boolean, id_budget: number, setIsVisible: (value: boolean) => void, ItemAddExpendSlice: (value: listeExpendInterface, indexBudget: number) => void, indexBudget: number }) => {
    const [actionType, setActionType] = useState("add");
    const [isDisabledBtnForm, setIsDisabledBtnForm] = useState(true);

    const [formExpend, setFormExpend] = useState({
        title: "",
        errorTitle: "",
        montant: "",
        errorMontant: "",
        category: "",
        errorCategory: "",
        type: "add",
        description: "",

    });


    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={
                () => {

                    setIsVisible(false);
                }
            }

        >
            <View style={Styles.modal}>
                <View style={Styles.View}>
                    <View style={Styles.TitleBlock}>
                        <Text style={actionType === "add" ? Styles.title : Styles.titleActive}
                            onPress={() => {
                                setActionType("withdrawal");
                            }}
                        >Retrait</Text>
                        <Text style={actionType === "withdrawal" ? Styles.title : Styles.titleActive}
                            onPress={() => {
                                setActionType("add");
                            }}
                        >Dépôt</Text>

                    </View>

                    <Input
                        placeholder={`nom du ${actionType === "add" ? " dépôt" : " retrait"}`}
                        value={formExpend.title}
                        onChangeText={(value) => {
                            checkForm({
                                title: value,
                                montant: formExpend.montant,
                                category: formExpend.category,
                            });

                        }}
                        errorMessage={formExpend.errorTitle}
                    />
                    <Input
                        keyboardType="numeric"
                        placeholder={`montant du ${actionType === "add" ? " dépôt" : " retrait"}`}
                        value={formExpend.montant}
                        onChangeText={(value) => {
                            checkForm({
                                title: formExpend.title,
                                montant: value,
                                category: formExpend.category,
                            });
                        }}
                        errorMessage={formExpend.errorMontant}
                    />

                    <View>
                        <Text>{formExpend.errorCategory}</Text>
                        <Picker
                            selectedValue={formExpend.category}

                            style={{ height: 50, width: "100%", marginBottom: 20 }}
                            onValueChange={(itemValue, itemIndex) => {
                                checkForm({


                                    title: formExpend.title,
                                    montant: formExpend.montant,
                                    category: itemValue,
                                });
                            }}
                        >
                            <Picker.Item label="Sélectionnée une catégorie" value="" />
                            <Picker.Item label="Alimentation" value="Alimentation" />
                            <Picker.Item label="Logement" value="Logement" />
                            <Picker.Item label="Santé" value="Santé" />
                            <Picker.Item label="Loisirs" value="Loisirs" />
                            <Picker.Item label="Vêtements" value="Vêtements" />
                            <Picker.Item label="Autres" value="Autres" />
                        </Picker>
                    </View>
                    <Button
                        radius={5}
                        disabled={isDisabledBtnForm}
                        title="ENREGISTRÉE"
                        onPress={() => {
                            setIsDisabledBtnForm(true);
                            DatabaseManager.createExpenses({
                                name: formExpend.title,
                                montant: parseFloat(formExpend.montant),
                                category: formExpend.category,
                                type: formExpend.type,
                                description: formExpend.description,
                                budget_id: id_budget
                            }).then((_expend: listeExpendInterface) => {

                                setFormExpend({
                                    title: "",
                                    errorTitle: "",
                                    montant: "",
                                    errorMontant: "",
                                    category: "",
                                    errorCategory: "",
                                    type: "expend",
                                    description: "",
                                });

                                ItemAddExpendSlice(_expend, indexBudget);
                                console.info("EXPEND REGISTER", _expend);
                                setIsVisible(false);

                            }).catch((error) => {
                                console.error(error);
                            });


                            setIsVisible(false);


                        }}
                    />
                </View>
            </View>
        </Modal >
    )

    function checkForm(form: { title: string, montant: string, category: string }) {
        const newForm = {
            ...formExpend,
            title: form.title,
            montant: form.montant,
            category: form.category,
        };

        if (form.title === "") {
            newForm.errorTitle = "Le champ est vide";
        } else {
            newForm.errorTitle = "";
        }
        if (form.montant === "") {
            newForm.errorMontant = "Le champ est vide";
        } else {
            newForm.errorMontant = "";
        }

        if (form.category === "") {
            newForm.errorCategory = "Veuillez sélectionner une catégorie";
        } else {
            newForm.errorCategory = "";
        }

        if (newForm.errorTitle == "" && newForm.errorMontant == "" && newForm.errorCategory == "") {
            setIsDisabledBtnForm(false);
        } else {
            setIsDisabledBtnForm(true);
        }


        setFormExpend(newForm);

    }
}


const Styles = StyleSheet.create({
    modal: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: "center",
    },
    View: {
        backgroundColor: "#fff",
        padding: 20,

        borderRadius: 20,
    },
    TitleBlock: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "50%",
        marginBottom: 40,
    },
    title: {
        fontSize: 19,
        fontWeight: "bold",
    },
    titleActive: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1D45D7",

        textDecorationLine: "underline",

    },
    Input: {},
    Button: {},
});