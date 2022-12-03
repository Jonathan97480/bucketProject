import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert, ImageBackground } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { addExpend, listeExpendInterface, PoleExpend } from '../redux/expendSlice';
import DatabaseManager from "../utils/DataBase";
import { Input, Button, Icon, Image } from "@rneui/themed/";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';
import { budgetInterface } from "../redux/budgetSlice";
import { getColorBudget } from "./Budget";

const IconAutres = require(`./icons/Autres.png`);
const IconAlimentation = require(`./icons/Alimentation.png`);
const IconLoisir = require(`./icons/Loisirs.png`);
const IconSanté = require(`./icons/Santé.png`);
/* const IconTransport = require(`./icons/Transport.png`); */
const IconVetement = require(`./icons/Vêtements.png`);
const IconLogement = require(`./icons/Logement.png`);



export const AddExpend = () => {

    const dispatch = useDispatch();
    const budget: PoleExpend[] = useSelector((state: any) => state.expend.expends);

    function ItemAddExpendSlice(Expend: listeExpendInterface, indexBudget: number) {
        let newBudgets = [...budget];
        let budgetCurent = { ...newBudgets[indexBudget] };
        budgetCurent.listeExpend = [...budgetCurent.listeExpend, Expend];

        newBudgets[indexBudget] = budgetCurent;


        const newBudgetMontant = Expend.type === "add" ? budgetCurent.montant + Expend.montant : budgetCurent.montant - Expend.montant;

        DatabaseManager.updateBudgetMontant(budgetCurent.id, newBudgetMontant).then(() => {

            newBudgets[indexBudget].montant = newBudgetMontant;

            dispatch(addExpend(newBudgets));
        });



    };

    function ItemDeleteExpendSlice(indexBudget: number, idExpend: number) {

        let newBudgets = [...budget];
        let budgetCurent = { ...newBudgets[indexBudget] };
        budgetCurent.listeExpend = [...budgetCurent.listeExpend];
        const curentExpends = budgetCurent.listeExpend.find((item) => item.id === idExpend);
        budgetCurent.listeExpend = budgetCurent.listeExpend.filter((item) => item.id !== idExpend);



        if (curentExpends !== undefined) {

            const newBudgetMontant = curentExpends.type === "add" ? budgetCurent.montant - curentExpends.montant : budgetCurent.montant + curentExpends.montant;

            newBudgets[indexBudget] = budgetCurent;

            DatabaseManager.updateBudgetMontant(budgetCurent.id, newBudgetMontant).then(() => {

                newBudgets[indexBudget].montant = newBudgetMontant;

                dispatch(addExpend(newBudgets));
            });


        } else {
            console.error("curentExpends not found");
        }


    }





    useEffect(() => {

        if (budget.length <= 0) {
            DatabaseManager.getBudget().then((data: budgetInterface[]) => {
                const newPoleExpends: PoleExpend[] = [];

                for (let index = 0; index < data.length; index++) {
                    const pole = data[index];
                    newPoleExpends.push({
                        id: pole.id,
                        nom: pole.name,
                        montant: pole.montant,
                        date: pole.date,
                        montantStart: pole.start_montant,
                        listeExpend: []
                    });

                }

                getExpend(newPoleExpends).then((_data: PoleExpend[]) => {
                    dispatch(addExpend(_data));
                });

            });
        }
    }, []);


    return (
        <SafeAreaView>

            <ScrollView style={{ paddingHorizontal: 10 }}>
                {budget.length !== 0 ? budget.map((pole, index) => {
                    return (
                        <SectionCustom key={`${pole.id}-${index}`}>
                            <Section_title title={pole.nom} id_budget={pole.id} remaining_budget={pole.montant} budget_start={pole.montantStart} indexBudget={index} ItemAddExpendSlice={ItemAddExpendSlice} />
                            <GenerateListeComponentsItemExpend listeExpend={pole.listeExpend} indexBudget={index} ItemDeleteExpendSlice={ItemDeleteExpendSlice} />
                        </SectionCustom>
                    )
                })
                    : <ActivityIndicator size="large" color="#0000ff" />}
            </ScrollView>

        </SafeAreaView>
    );

}


export const Section_title = ({ title, remaining_budget, budget_start, id_budget, ItemAddExpendSlice, indexBudget }: { title: string, remaining_budget: number, id_budget: number, budget_start: number, ItemAddExpendSlice: (value: listeExpendInterface, indexBudget: number) => void, indexBudget: number }) => {

    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={[stylesSectionTitle.section_title,
        {
            backgroundColor: getColorBudget(remaining_budget, budget_start)
        }

        ]}>
            <Text
                style={stylesSectionTitle.section_title_text}
            >{remaining_budget}€</Text>
            <Text style={stylesSectionTitle.section_title_text}>{textSizeFixe(title, 20)}</Text>
            <Icon name="plus" type="font-awesome" size={20} color="#000" onPress={() => {
                setModalVisible(true);
            }}

                style={
                    {
                        padding: 10,
                        backgroundColor: "#fff",
                        borderRadius: 50,
                        width: 40,
                        height: 40,
                        borderWidth: 1,
                        overflow: 'hidden',



                    }
                }

            />
            <ModalAddExpend id_budget={id_budget} isVisible={modalVisible} setIsVisible={setModalVisible} ItemAddExpendSlice={ItemAddExpendSlice} indexBudget={indexBudget} />
        </View>
    );

}


const stylesSectionTitle = StyleSheet.create({
    section_title: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginBottom: 20,
        borderRadius: 20,

    },
    section_title_text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff"
    },
});


export const SectionCustom = ({ children }: { children?: JSX.Element | JSX.Element[]; }) => {

    return (
        <View >
            {children}
        </View>
    )
}


export const ItemBudget = ({ title, montant, id_expend, name_category, ItemDeleteExpendSlice, indexBudget, type }: { title: string, montant: number, id_expend: number, name_category: string, ItemDeleteExpendSlice: any, indexBudget: number, type: string }) => {

    const [modalVisible, setModalVisible] = useState(false);

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
                                DatabaseManager.deleteExpend(id_expend).then(() => {

                                    ItemDeleteExpendSlice(indexBudget, id_expend);
                                });
                            }
                        }
                    ],
                    { cancelable: false }
                );



            }}
            onPress={() => {
                setModalVisible(true);
            }}>
            <View style={stylesItemBudget.itemBudget}>
                <Text
                    style={{
                        width: "45%",
                    }}

                >{textSizeFixe(title, 17)}</Text>
                <Text>{montant}€</Text>
                <View style={{
                    backgroundColor: type === "add" ? "#203EAA" : "#E1424B",
                    padding: 1,
                    paddingHorizontal: 12,
                    borderRadius: 5,
                    alignItems: "center",

                }}>
                    <Text style={{ color: "#fff" }} >{type === "add" ? "Depot" : "Retrait"}</Text>
                </View>
                <Image
                    resizeMode="cover"
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        marginLeft: 10
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
                <ExpendInfo date={"12/20/2022"} name_category={name_category} montant={montant} title={title} type={type}
                    isModalVisible={modalVisible} setIsModalVisible={setModalVisible}
                    index_budget={indexBudget}
                    id_expend={id_expend}
                    ItemDeleteExpendSlice={ItemDeleteExpendSlice}

                />
            </View>
        </TouchableOpacity>
    );
}


const stylesItemBudget = StyleSheet.create({

    itemBudget: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: "rgba(0,0,0,0.72)",
        borderBottomWidth: 2,
        paddingBottom: 13,
        paddingHorizontal: 20,
    }
});


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
            <View style={StyleModal.modal}>
                <View style={StyleModal.View}>
                    <View style={StyleModal.TitleBlock}>
                        <Text style={actionType === "add" ? StyleModal.title : StyleModal.titleActive}
                            onPress={() => {
                                setActionType("withdrawal");
                            }}
                        >Retrait</Text>
                        <Text style={actionType === "withdrawal" ? StyleModal.title : StyleModal.titleActive}
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


const StyleModal = StyleSheet.create({
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



async function getExpend(data: PoleExpend[]) {

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        await DatabaseManager.getExpensesByBudget(element.id).then((_data) => {

            data[i].listeExpend = _data;

        });

    }

    return data;
}


export function GenerateListeComponentsItemExpend({ listeExpend, ItemDeleteExpendSlice, indexBudget }: { listeExpend: listeExpendInterface[], ItemDeleteExpendSlice: any, indexBudget: number }) {

    return (
        <>
            {
                listeExpend.length > 0 ?
                    listeExpend.map((item, index) => {
                        return (
                            <ItemBudget key={index} title={item.name} montant={item.montant} id_expend={item.id} name_category={item.category} ItemDeleteExpendSlice={ItemDeleteExpendSlice} indexBudget={indexBudget} type={item.type} />
                        )
                    })
                    : <Text style={{ textAlign: "center" }}>Vous n'avez pas encore d'éléments dans ce budget</Text>

            }

        </>
    )

}


function textSizeFixe(text: string, size: number) {
    if (text.length > size) {
        return text.slice(0, size) + "...";
    }
    return text;
}


export function ExpendInfo({ name_category, montant, title, type, date, index_budget, id_expend, ItemDeleteExpendSlice, isModalVisible, setIsModalVisible }: { date: string, name_category: string, montant: number, title: string, type: string, index_budget: number, id_expend: number, ItemDeleteExpendSlice: any, isModalVisible: boolean, setIsModalVisible: any }) {
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
                    source={require("./images/Background_recipe.png")}
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
                                                ItemDeleteExpendSlice(index_budget, id_expend);
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