

import React, { useEffect, useState } from 'react'
import { Modal, View, StyleSheet, Text } from 'react-native'
import { Input, Icon, Button } from '@rneui/base';
import DatabaseManager from '../../utils/DataBase'
import { useDispatch, useSelector } from 'react-redux';
import { getAllExpend } from '../../utils/GetBudgetAndExpend';
import { addExpend, PoleExpend } from '../../redux/expendSlice';
import { colorList } from '../../utils/ColorCollection';
import { addComptes, CompteInterface } from '../../redux/comptesSlice';
import { Picker } from '@react-native-picker/picker';


interface ModalAddBudgetProps {
    isViewModalAddBudget: boolean,
    setIsViewModalAddBudget: (value: boolean) => void,
    budget?: PoleExpend
}
interface FormAddBudget {
    name: string,
    montant: string,
    errorMontant: string,
    errorName: string,
    id: number,
    id_compte: number
}

export const ModalAddBudget = ({ isViewModalAddBudget, setIsViewModalAddBudget, budget }: ModalAddBudgetProps) => {

    const dispatch = useDispatch();
    const comptes: CompteInterface[] = useSelector((state: any) => state.compte.comptes);



    const [formAddBudget, setFormAddBudget] = useState<FormAddBudget>(getValueDefaultForm());

    useEffect(() => {

        if (budget?.id !== undefined) {
            DatabaseManager.getCompteIdByBudgetId(budget.id).then((_data) => {
                if (_data !== undefined && _data !== null && _data !== 0) {
                    setFormAddBudget({
                        ...formAddBudget,

                        id_compte: _data,
                        name: budget.nom,
                        montant: budget.montant.toString(),
                        id: budget.id,
                    })
                } else {
                    setFormAddBudget({
                        ...formAddBudget,


                        name: budget.nom,
                        montant: budget.montant.toString(),
                        id: budget.id,
                    })
                }
            });
        }
    }, [budget])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isViewModalAddBudget}
            onRequestClose={() => {
                setIsViewModalAddBudget(false);

            }}
            style={styles.modal}
        >

            <View style={styles.modalContainer}>


                <View style={styles.modalBody}>
                    <Text style={styles.titleModal}>Ajoutez un budget</Text>
                    <View>
                        <Text style={styles.modalInputLabel}>nom :</Text>
                        <Input placeholder="nom de votre budget"
                            value={formAddBudget.name}
                            onChangeText={(value) => {
                                setFormAddBudget({ ...formAddBudget, name: value });
                            }}
                        />
                    </View>
                    <View>
                        <Text style={styles.modalInputLabel}>montant :</Text>
                        <Input placeholder="montant de votre budget"
                            keyboardType="numeric"
                            value={formAddBudget.montant}
                            onChangeText={(value) => {
                                setFormAddBudget({ ...formAddBudget, montant: value });
                            }}
                        />
                    </View>
                    <View>
                        <Text style={styles.modalInputLabel}>vous pouvez lier votre budget a un compte :</Text>
                        <Picker
                            accessibilityLabel='compte'
                            selectedValue={formAddBudget.id_compte}
                            onValueChange={(itemValue, itemIndex) => {

                                setFormAddBudget({ ...formAddBudget, id_compte: itemValue });
                            }}
                        >
                            <Picker.Item label="Aucun" value={0} />

                            {comptes.map((compte, index) => {
                                return (
                                    <Picker.Item key={index + "-compte-picker"} label={compte.name} value={compte.id} />
                                )
                            })}
                        </Picker>
                    </View>

                    <Button
                        title={budget ? "Enregistrée" : 'Ajouter'}
                        onPress={() => {

                            AddAndUpdateBudget(formAddBudget.id);
                        }
                        }
                        icon={
                            <Icon
                                name="check"
                                size={15}
                                color="white"
                                type='font-awesome'

                            />
                        }

                    />


                </View>
            </View>


        </Modal >
    );



    function AddAndUpdateBudget(id: number) {


        if (id <= 0) {
            DatabaseManager.createBudget(
                formAddBudget.name,
                parseFloat(formAddBudget.montant),
                parseFloat(formAddBudget.montant)).then((_id_budget) => {
                    getAllExpend().then((_data) => {
                        if (formAddBudget.id_compte && formAddBudget.id_compte > 0) {
                            DatabaseManager.linkCompteToBudget(_id_budget, formAddBudget.id_compte).then(() => {
                                ResetForm()
                                setIsViewModalAddBudget(false);

                                dispatch(addExpend(_data));



                            });
                        }
                        else {
                            ResetForm()
                            setIsViewModalAddBudget(false);
                            dispatch(addExpend(_data));
                        }


                    });
                });
        } else {

            if (!budget) return;

            console.log("budgetUPdate", budget);

            const diffMontant = parseFloat(formAddBudget.montant) - budget.montantStart;
            const newCurentMontant = parseFloat(formAddBudget.montant) > budget.montantStart ?
                budget.montant + diffMontant :
                budget.montant - diffMontant;


            DatabaseManager.updateBudget(id, parseFloat(formAddBudget.montant), newCurentMontant, formAddBudget.name, budget.isList).then(() => {
                getAllExpend().then((_data) => {
                    if (formAddBudget.id_compte && formAddBudget.id_compte > 0) {
                        DatabaseManager.getCompteIdByBudgetId(id).then((id_compte) => {

                            switch (id_compte) {
                                case 0:
                                    DatabaseManager.linkCompteToBudget(id, formAddBudget.id_compte).then(() => {

                                        ResetForm()
                                        setIsViewModalAddBudget(false);
                                        dispatch(addExpend(_data));

                                    });
                                    break;
                                case formAddBudget.id_compte:
                                    ResetForm()
                                    setIsViewModalAddBudget(false);
                                    dispatch(addExpend(_data));
                                    break;
                                default:
                                    DatabaseManager.deleteLInkBudgetByIdCompte(id_compte, id).then(() => {
                                        DatabaseManager.linkCompteToBudget(id, formAddBudget.id_compte).then(() => {

                                            ResetForm()
                                            setIsViewModalAddBudget(false);
                                            dispatch(addExpend(_data));

                                        });
                                    });
                                    break;
                            }

                        });
                    } else {
                        ResetForm()
                        setIsViewModalAddBudget(false);
                        dispatch(addExpend(_data));
                    }



                });
            });
        }

    }


    function ValidateForm() {
        let isValid = true;
        if (formAddBudget.name.length <= 0) {
            setFormAddBudget({ ...formAddBudget, errorName: 'le nom est obligatoire' });
            isValid = false;
        }
        if (formAddBudget.montant.length <= 0) {
            setFormAddBudget({ ...formAddBudget, errorMontant: 'le montant est obligatoire' });
            isValid = false;
        }
        return isValid;
    }


    function ResetForm() {
        setFormAddBudget({ name: '', montant: '', errorMontant: '', errorName: '', id: 0, id_compte: 0 });
    }



    function getValueDefaultForm(): FormAddBudget {


        return { name: '', montant: '', errorMontant: '', errorName: '', id: 0, id_compte: 0 };
    }



}






const styles = StyleSheet.create({

    modal: {
        elevation: 5,

    },
    titleModal: {

        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {

        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalHeader: {},
    modalBody: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',

    },
    modalInputLabel: {
        fontSize: 15,
        fontWeight: 'bold',

    },
    modalFooter: {},
    color_primary_text: {
        color: colorList.primary,
        textTransform: 'capitalize',
    }


})