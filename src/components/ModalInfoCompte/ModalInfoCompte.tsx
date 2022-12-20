import { useNavigation } from '@react-navigation/native';
import { Button, ListItem } from '@rneui/base';
import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CompteInterface } from '../../redux/comptesSlice';
import { addExpend, PoleExpend } from "../../redux/expendSlice";
import { getColorBudget } from '../../utils/ColorCollection';
import { getAllExpend } from '../../utils/GetBudgetAndExpend';



interface ModalInfoCompteProps {

    isViewModalInfoCompte: boolean,
    setIsViewModalInfoCompte: (isView: boolean) => void,
    compte: CompteInterface
    budgets: PoleExpend[]
    index: number
}

export const ModalInfoCompte = ({ isViewModalInfoCompte, setIsViewModalInfoCompte, compte, budgets, index }: ModalInfoCompteProps) => {

    const dispatch = useDispatch();
    const navigation = useNavigation() as any;
    const AllBudget: PoleExpend[] = useSelector((state: any) => state.expend.expends);

    useEffect(() => {
        if (AllBudget.length <= 0) {

            getAllExpend().then((data) => {
                if (data.length > 0) {
                    dispatch(addExpend(data));
                }
            });
        }
    }, [])

    return (
        <Modal
            animationType="slide"

            visible={isViewModalInfoCompte}
            onRequestClose={() => {
                setIsViewModalInfoCompte(false);
            }}
        >
            <View >
                <View>
                    <View >
                        <Text style={styles.title}>Information du compte </Text>
                        <Text style={styles.smallText}>nom : {compte.name}</Text>
                    </View>
                    <View >

                        <Text style={styles.smallText} >Montant : {compte.montant}€</Text>

                        <Text style={styles.smallText} >Date : {compte.date}</Text>


                    </View>
                    <Text style={styles.title}>La liste des budgets liée au compte</Text>
                    {
                        budgets.map((budget, index) => {
                            return (
                                <ListItem
                                    key={index + "budget-list-item"}
                                    containerStyle={[styles.containerList, { backgroundColor: getColorBudget(budget.montant, budget.montantStart) }]}
                                    onPress={() => {
                                        setIsViewModalInfoCompte(false);

                                        const indexBudget = AllBudget.findIndex((item) => item.id === budget.id);

                                        navigation.navigate('AddExpendBudget', { curentBudget: budget, indexBudget: indexBudget });
                                    }}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title
                                            style={styles.titleList}
                                        >{budget.nom}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron />
                                </ListItem>

                            )

                        })
                    }
                    <View
                        style={{
                            marginVertical: 10,
                            marginHorizontal: 10
                        }}
                    >
                        <Button title="Fermer" onPress={() => setIsViewModalInfoCompte(false)} />
                    </View>
                </View>
            </View>
        </Modal>
    )

}

const styles = StyleSheet.create({
    container: {},
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10
    },
    smallText: {
        fontSize: 14,
        fontWeight: "bold",

    },

    containerList: {

        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,


    }, titleList: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        textTransform: "uppercase"
    }
})