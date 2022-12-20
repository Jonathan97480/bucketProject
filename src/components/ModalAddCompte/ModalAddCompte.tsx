


import { Button, Input } from '@rneui/base';
import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addComptesArray } from '../../redux/comptesSlice';
import DatabaseManager from "../../utils/DataBase";



interface ModalAddCompteProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export const ModalAddCompte = ({ visible, setVisible }: ModalAddCompteProps) => {

    const [Compte, setCompte] = useState(defaultFromState());
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
            <View style={styles.container}>
                <View
                    style={styles.formContainer}
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


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100%",
        height: "100%",
        padding: 20,

    },
    formContainer: {
        backgroundColor: "#fff",
        width: "100%",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
    }
})