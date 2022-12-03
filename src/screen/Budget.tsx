import { Button, Input, ListItem } from "@rneui/base";
import { Icon } from "@rneui/themed";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from 'react-redux';
import { addBudget, budgetInterface } from '../redux/budgetSlice';
import DatabaseManager from "../utils/DataBase";

const colorList = {
    good: '#59ab60',
    bad: '#d15b4b',
    normal: '#596cab',
    primary: '#fff',
}



export const Budget = () => {

    const dispatch = useDispatch();
    const budget: budgetInterface[] = useSelector((state: any) => state.budget.budget);
    const [isViewModalAddBudget, setIsViewModalAddBudget] = React.useState(false);
    const [formAddBudget, setFormAddBudget] = React.useState({
        name: '',
        errorName: '',
        montant: '',
        errorMontant: '',
    });


    useEffect(() => {

        if (budget.length === 0) {
            DatabaseManager.getBudget().then((data: budgetInterface[]) => {
                if (data.length > 0) {
                    dispatch(addBudget(data));
                }
            });
        }


    }, [budget]);




    return (
        <SafeAreaView >

            <View style={styles.container}>
                <TouchableOpacity
                    disabled={isViewModalAddBudget}
                    style={styles.btnAddBudget}
                    onPress={() => {
                        setIsViewModalAddBudget(true);
                    }}
                >
                    <Icon name="cart-plus" type='font-awesome' color={colorList.bad} size={50} />
                </TouchableOpacity>

                <ScrollView style={styles.list}>
                    {
                        budget.length > 0 &&
                        budget.map((item: budgetInterface) => {
                            return (
                                <View style={{ marginVertical: 5 }} key={item.id}>
                                    <ListItem.Swipeable

                                        containerStyle={[{ backgroundColor: getColorBudget(item.montant, item.start_montant) }]}

                                        leftContent={(reset) => (
                                            <Button
                                                title="Info"
                                                onPress={() => reset()}
                                                icon={{ name: 'info', color: 'white' }}
                                                buttonStyle={{ minHeight: '100%' }}
                                            />
                                        )}
                                        rightContent={(reset) => (
                                            <Button
                                                title="Delete"
                                                onPress={() => {
                                                    reset()
                                                    DatabaseManager.deleteAllExpendByBudget(item.id).then(() => {

                                                        DatabaseManager.deleteBudget(item.id).then(() => {

                                                            DatabaseManager.getBudget().then((data: budgetInterface[]) => {
                                                                if (data.length > 0) {

                                                                    dispatch(addBudget(data));
                                                                } else {
                                                                    dispatch(addBudget([]));
                                                                }
                                                            });

                                                        });

                                                    });

                                                }
                                                }
                                                icon={{ name: 'delete', color: 'white' }}
                                                buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                                            />
                                        )}
                                    >
                                        <Icon
                                            name="dollar"
                                            type='font-awesome'
                                            color={colorList.primary}
                                        />
                                        <ListItem.Content

                                        >
                                            <ListItem.Title
                                                style={{ color: colorList.primary }}
                                            >{item.name}</ListItem.Title>
                                        </ListItem.Content>
                                        <ListItem.Chevron />
                                    </ListItem.Swipeable>
                                </View>
                            )
                        })
                    }
                </ScrollView>
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
                            <Text style={styles.titelModal}>Ajoutez un budget</Text>
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
                                    setIsViewModalAddBudget(false);

                                    DatabaseManager.createBudget(
                                        formAddBudget.name,
                                        parseFloat(formAddBudget.montant),
                                        parseFloat(formAddBudget.montant)).then(() => {
                                            DatabaseManager.getBudget().then((data: budgetInterface[]) => {
                                                console.log("DATA", data);
                                                if (data.length > 0) {
                                                    dispatch(addBudget(data));
                                                } else {
                                                    dispatch(addBudget([]));
                                                }
                                            });
                                        });
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


                </Modal>
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {


        justifyContent: 'center',
        padding: 10,
        height: '100%',


    },
    list: {
        marginTop: 60,
    },
    btnAddBudget: {
        position: 'absolute',
        top: 10,
        left: '50%',

    },
    modal: {
        elevation: 5,

    },
    titelModal: {

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
});


export function getColorBudget(montant: number, start_montant: number) {
    if (montant > start_montant) {
        return colorList.good;
    } else if (montant <= start_montant / 10 && montant > (start_montant * 40) / 100 || montant === start_montant) {
        return colorList.normal;
    } else {
        return colorList.bad;
    }
}


