import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import { Input, Button } from "@rneui/themed/";
import { Picker } from '@react-native-picker/picker';
import DatabaseManager from "../../utils/DataBase";
import { addExpend, listeExpendInterface, PoleExpend } from "../../redux/expendSlice";
import { fixedFloatNumber, ItemAddExpendSlice, ItemDeleteExpendSlice } from "../../utils/ExpendManipulation";
import { useSelector, useDispatch } from 'react-redux';



interface ModalAddExpendProps {
    isVisible: boolean,
    id_budget: number,
    setIsVisible: (value: boolean) => void,
    expend?: listeExpendInterface,

    indexBudget: number
}

interface FormAddExpendInterface {
    title: string,
    errorTitle: string,
    montant: string,
    errorMontant: string,
    category: string,
    errorCategory: string,
    type: string,
    description: string,
    quantity: string,
    errorQuantity: string,

}

export const ModalAddExpend = ({ isVisible, id_budget, setIsVisible, indexBudget, expend }: ModalAddExpendProps) => {


    const [actionType, setActionType] = useState("add");
    const [isDisabledBtnForm, setIsDisabledBtnForm] = useState(true);

    const dispatch = useDispatch();
    const budget = useSelector((state: any) => state.expend.expends);

    const [formExpend, setFormExpend] = useState<FormAddExpendInterface>(returnDefaultValueForm(expend));

    useEffect(() => {
        if (!expend) {
            if (formExpend.type !== actionType) {
                setActionType(formExpend.type);
            }
        } else {
            setActionType(expend.type);
        }

    }, []);


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
                                setActionTypeForm("withdrawal");

                            }}
                        >Retrait</Text>
                        <Text style={actionType === "withdrawal" ? Styles.title : Styles.titleActive}
                            onPress={() => {
                                setActionTypeForm("add");

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
                                quantity: formExpend.quantity,
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
                                quantity: formExpend.quantity
                            });
                        }}
                        errorMessage={formExpend.errorMontant}
                    />
                    <Input
                        keyboardType="numeric"
                        placeholder={"Quantité"}
                        value={formExpend.quantity}
                        onChangeText={(value) => {
                            checkForm({
                                title: formExpend.title,
                                montant: formExpend.montant,
                                category: formExpend.category,
                                quantity: value,
                            });
                        }}
                    />
                    < View >
                        <Text>{formExpend.errorCategory}</Text>
                        <Picker
                            selectedValue={formExpend.category}

                            style={{ height: 50, width: "100%", marginBottom: 20 }}
                            onValueChange={(itemValue, itemIndex) => {
                                checkForm({


                                    title: formExpend.title,
                                    montant: formExpend.montant,
                                    category: itemValue,
                                    quantity: formExpend.quantity,

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

                            if (expend) {
                                updateExpend();
                            } else {
                                saveExpend();
                            }




                        }}
                    />
                </View>
            </View>
        </Modal >
    )

    function checkForm(form: { title: string, montant: string, category: string, quantity: string, }) {
        const newForm = {
            ...formExpend,
            title: form.title,
            montant: form.montant,
            category: form.category,
            quantity: form.quantity,
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

        newForm.quantity = form.quantity;
        newForm.type = actionType;

        setFormExpend(newForm);

    }

    function fixedQuantity(quantity: string): string {
        if (quantity === "") {
            return "1";
        } else {
            return quantity;
        }
    }
    function resetForm() {
        setFormExpend({
            title: "",
            errorTitle: "",
            montant: "",
            errorMontant: "",
            category: "",
            errorCategory: "",
            type: "withdrawal",
            description: "",
            quantity: "",
            errorQuantity: "",
        });
    }

    function calculateTotalExpend(montant: number, quantity: number): number {
        let total = 0;
        total = montant * quantity;
        return fixedFloatNumber(total);

    }

    function returnDefaultValueForm(expend?: listeExpendInterface): FormAddExpendInterface {
        let value: FormAddExpendInterface = {
            title: "",
            errorTitle: "",
            montant: "",
            errorMontant: "",
            category: "",
            errorCategory: "",
            type: "add",
            description: "",
            quantity: "",
            errorQuantity: "",

        }

        if (expend) {
            value = {
                title: expend.name,
                errorTitle: "",
                montant: expend.montant.toString(),
                errorMontant: "",
                category: expend.category,
                errorCategory: "",
                type: expend.type,
                description: expend.description,
                quantity: expend.quantity.toString(),
                errorQuantity: "",
            };
        }

        return value;
    }

    function saveExpend() {
        DatabaseManager.createExpenses({
            name: formExpend.title,
            montant: parseFloat(formExpend.montant),
            montant_total: calculateTotalExpend(
                parseFloat(formExpend.montant),
                parseInt(fixedQuantity(formExpend.quantity))
            ),
            category: formExpend.category,
            type: formExpend.type,
            description: formExpend.description,
            budget_id: id_budget,
            quantity: parseInt(fixedQuantity(formExpend.quantity)),
        }).then((_expend: listeExpendInterface) => {



            ItemAddExpendSlice(_expend, indexBudget, budget).then((_data: PoleExpend[]) => {
                resetForm();
                dispatch(addExpend(_data));
            }).catch((err) => {
                console.error("EXPEND REGISTER", err);
            });

            setIsVisible(false);

        }).catch((error) => {
            console.error(error);
        });
    }


    function updateExpend() {

        if (expend) {

            const oldExpend = { ...expend };
            const newExpend = CreateNewExpendForUpdate(expend);

            DatabaseManager.updateExpend({
                id: newExpend.id,
                name: newExpend.name,
                montant: newExpend.montant,
                montant_total: newExpend.montant_total,
                category: newExpend.category,
                type: newExpend.type,
                quantity: newExpend.quantity,

            }).then(() => {

                ItemDeleteExpendSlice(indexBudget, oldExpend.id, budget).then((_data: PoleExpend[]) => {

                    ItemAddExpendSlice(newExpend, indexBudget, _data).then((_data2: PoleExpend[]) => {

                        resetForm();
                        dispatch(addExpend(_data2));
                        setIsVisible(false);

                    }).catch((err) => {

                        console.error("EXPEND REGISTER NEW VALUE ERROR", err);
                    });

                    setIsVisible(false);

                }).catch((err) => {

                    console.error("Update Expend fixe budget 1 ERROR", err);
                });

            }).catch((error) => {

                console.error(error);
            });
        }
    }

    function setActionTypeForm(type: string) {
        setActionType(type);
        checkForm(formExpend);
    }

    function CreateNewExpendForUpdate(expend: listeExpendInterface): listeExpendInterface {
        return {
            ...expend,
            montant: parseFloat(formExpend.montant),
            montant_total: calculateTotalExpend(
                parseFloat(formExpend.montant),
                parseInt(fixedQuantity(formExpend.quantity))
            ),
            name: formExpend.title,
            quantity: parseInt(fixedQuantity(formExpend.quantity)),
            type: actionType,
            category: formExpend.category,

        }
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