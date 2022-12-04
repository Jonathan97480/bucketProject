

import React from 'react'
import { Modal, View, StyleSheet, Text } from 'react-native'
import { Input, Icon, Button } from '@rneui/base';
import DatabaseManager from '../utils/DataBase'
import { useDispatch } from 'react-redux';
import { getAllExpend } from '../utils/GetBudgetAndExpend';
import { addExpend, PoleExpend } from '../redux/expendSlice';
import { colorList } from '../utils/ColorCollection';


interface ModalAddBudgetProps {
    isViewModalAddBudget: boolean,
    setIsViewModalAddBudget: (value: boolean) => void,
    budget?: PoleExpend
}


export const ModalAddBudget = ({ isViewModalAddBudget, setIsViewModalAddBudget, budget }: ModalAddBudgetProps) => {

    const dispatch = useDispatch();

    const [formAddBudget, setFormAddBudget] = React.useState(getValueDefaultForm(budget));


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

                    <Button
                        title={'Ajouter'}
                        onPress={() => {

                            if (ValidateForm()) {
                                AddAndUpdateBudget(formAddBudget.id);
                            }
                        }}
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
                parseFloat(formAddBudget.montant)).then(() => {
                    getAllExpend().then((_data) => {

                        ResetForm()
                        setIsViewModalAddBudget(false);
                        dispatch(addExpend(_data));

                    });
                });
        } else {
            DatabaseManager.updateBudget(id, parseFloat(formAddBudget.montant), formAddBudget.name).then(() => {
                getAllExpend().then((_data) => {

                    ResetForm()
                    setIsViewModalAddBudget(false);
                    dispatch(addExpend(_data));

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
        setFormAddBudget({ name: '', montant: '', errorMontant: '', errorName: '', id: 0 });
    }

    function getValueDefaultForm(budget: PoleExpend | undefined) {
        if (!budget) {
            return { name: '', montant: '', errorMontant: '', errorName: '', id: 0 };
        }
        return { name: budget.nom, montant: budget.montantStart.toString(), errorMontant: '', errorName: '', id: budget.id };
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