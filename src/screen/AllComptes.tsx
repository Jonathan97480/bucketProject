import { Icon, ListItem } from "@rneui/base";
import React, { useEffect } from "react";

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Button } from "@rneui/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import DatabaseManager from "../utils/DataBase";
import { addComptes, addComptesArray, CompteInterface } from "../redux/comptesSlice";
import { ExpendState, listeExpendInterface, PoleExpend } from "../redux/expendSlice";



export default function AllComptes() {
    const [isCompteModalVisible, setIsCompteModalVisible] = React.useState(false);
    const dispatch = useDispatch();
    const comptes: CompteInterface[] = useSelector((state: any) => state.compte.comptes);

    useEffect(() => {

        if (comptes.length <= 0) {
            DatabaseManager.getAllCompte().then((comptes) => {
                if (comptes.length > 0) {
                    dispatch(addComptes(comptes))
                }
            });
        }


    }, [comptes]);


    return (
        <SafeAreaView>
            <View style={styles.container}>
                <ScrollView>
                    {
                        comptes.map((compte, index) => {
                            return (
                                <ComptesItem
                                    key={index + "-compte"}
                                    item={{
                                        name: compte.name,
                                        montant: compte.montant,
                                        id: compte.id,
                                        date: compte.date,
                                        index: index
                                    }}
                                />
                            )
                        })
                    }
                </ScrollView>
                <Button
                    title="Ajouter un compte"
                    onPress={onPress}

                />
            </View>
            <ModalAddCompte
                visible={isCompteModalVisible}
                setVisible={setIsCompteModalVisible}
            />
        </SafeAreaView>
    );
    function onPress() {
        setIsCompteModalVisible(true);
    }
}




interface ComptesItemProps {
    item: any;
}

export const ComptesItem = ({ item }: ComptesItemProps) => {

    const [isModalVisible, setIsModalVisible] = React.useState(false);


    return (
        <>
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                    margin: 10,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                }}
                onPress={onPress}
                onLongPress={onLongPress}
            >
                <Icon
                    name="account-balance-wallet"
                    size={30}
                    color="#900"

                />
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginLeft: 10,

                    }}
                >{item.name}</Text>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginLeft: 10,

                    }}
                >{item.montant}€</Text>
            </TouchableOpacity>
            <ModalInfoCompte
                isViewModalInfoCompte={isModalVisible}
                setIsViewModalInfoCompte={setIsModalVisible}
                compte={item}
                index={item.index}
            />
        </>
    )

    function onPress() {
        setIsModalVisible(true);
    }

    function onLongPress() {
        console.log("onLongPress");
    }

}


interface ModalAddCompteProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export const ModalAddCompte = ({ visible, setVisible }: ModalAddCompteProps) => {

    const [Compte, setCompte] = React.useState(defaultFromState());
    const dispatch = useDispatch();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                setVisible(false);
            }}
        >
            <View style={[styles.container, { padding: 20 }]}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: "100%",
                        padding: 20,
                        borderRadius: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                    }}
                >

                    <Input
                        placeholder="Nom du compte"
                        value={Compte.name}
                        errorMessage={Compte.errorName}
                        label="Nom du compte"
                        onChangeText={text => setCompte((prevState) => {
                            return {
                                ...prevState,
                                name: text,

                            }
                        })}

                    />
                    <Input
                        placeholder="Montant du compte"
                        keyboardType="numeric"
                        value={Compte.amount}
                        errorMessage={Compte.errorAmount}
                        label="Montant"
                        onChangeText={text => setCompte((prevState) => {
                            return {
                                ...prevState,
                                amount: text,

                            }
                        })}
                    />
                    <Button
                        title="Ajouter"
                        disabled={validateForm()}
                        onPress={onPress}
                    />
                </View>

            </View>
        </Modal>
    );

    function onPress() {
        DatabaseManager.createCompte({
            name: Compte.name,
            montant: parseFloat(Compte.amount)
        }).then((compte) => {
            dispatch(addComptesArray(compte));
            setVisible(false);
            setCompte(defaultFromState());
        });
    }

    function defaultFromState() {
        return {
            name: "",
            errorName: "",
            amount: "",
            errorAmount: ""
        }
    }

    function validateForm() {
        let isNotValid = false;
        if (Compte.name.length <= 0) {
            isNotValid = true;
            if (Compte.errorName.length <= 0)
                setCompte((prevState) => {
                    return {
                        ...prevState,
                        errorName: "Le nom du compte est obligatoire"
                    }
                })
            return isNotValid;
        }
        if (Compte.amount.length <= 0) {
            isNotValid = true;
            if (Compte.errorAmount.length <= 0) {
                setCompte((prevState) => {
                    return {
                        ...prevState,
                        errorAmount: "Le montant du compte est obligatoire"

                    }
                })
            }
            return isNotValid;
        }

        if (Compte.errorName.length > 0 || Compte.errorAmount.length > 0) {
            setCompte((prevState) => {
                return {
                    ...prevState,
                    errorName: "",
                    errorAmount: ""
                }
            })
        }
        return isNotValid;
    }
}

interface ModalInfoCompteProps {

    isViewModalInfoCompte: boolean,
    setIsViewModalInfoCompte: (isView: boolean) => void,
    compte: CompteInterface
    index: number
}

export const ModalInfoCompte = ({ isViewModalInfoCompte, setIsViewModalInfoCompte, compte, index }: ModalInfoCompteProps) => {

    const [budgets, setBudgets] = React.useState<PoleExpend[]>([]);

    const budget: PoleExpend[] = useSelector((state: any) => state.expend.expends);

    useEffect(() => {
        DatabaseManager.getBudgetByCompteId(compte.id).then((budgets) => {
            console.log("budgets", budgets);
            setBudgets(budgets);
        });
    }, [budget]);

    return (
        <Modal
            animationType="slide"

            visible={isViewModalInfoCompte}
            onRequestClose={() => {
                setIsViewModalInfoCompte(false);
            }}
        >
            <View >
                <View >
                    <View >
                        <Text >Information du compte </Text>
                        <Text>{compte.name}</Text>
                    </View>
                    <View >

                        <Text >Montant</Text>
                        <Text>{compte.montant}</Text>
                        <Text >Date de création</Text>
                        <Text>{compte.date}</Text>

                    </View>
                    <Text>La liste des budget lier au compte</Text>
                    <ListItem

                        bottomDivider
                        onPress={() => {
                            setIsViewModalInfoCompte(false);
                        }}
                    >
                        <ListItem.Content>
                            {
                                budgets.map((budget, index) => {
                                    return (
                                        <ListItem.Title
                                            key={index + "budget-list-item"}
                                        >{budget.nom}</ListItem.Title>
                                    )
                                })
                            }

                        </ListItem.Content>
                        <ListItem.Chevron />


                    </ListItem>

                    <View >
                        <Button title="Fermer" onPress={() => setIsViewModalInfoCompte(false)} />
                    </View>
                </View>
            </View>
        </Modal>
    )

}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100%",
        height: "100%",
        paddingBottom: 20,
    },
    text: {
        fontSize: 30,
    },
});