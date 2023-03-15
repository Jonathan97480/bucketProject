import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, addons } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Input } from "@rneui/base";
import { addExpend, listeExpendInterface, PoleExpend } from '../../redux/expendSlice';
import { useRoute } from '@react-navigation/native';
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { ItemBudget } from "../../components/ItemBudget/ItemBudget";
import { getAllExpend } from "../../utils/GetBudgetAndExpend";
import { OperationArrayAlphabetizeOrder, textSizeFixe } from "../../utils/TextManipulation";
import { SimpleTransactionInterface, TransactionMonthInterface } from "../../redux/comptesSlice";
import globalStyle from "../../assets/styleSheet/globalStyle";
import { getColorBudget } from "../../utils/ColorCollection";
import { ModalAddExpend } from "./ModalAddExpend/ModalAddOperation";
import { CustomSafeAreaView } from "../../components";
import { rechercheExpendByName } from "./logic";


interface AddOperationInTheBudgetProps {

    route: any
}

export const AddOperationInTheBudget = ({ route }: AddOperationInTheBudgetProps) => {

    const dispatch = useDispatch();
    const budget: TransactionMonthInterface = useSelector((state: any) => state.compte.curentBudget);
    console.log("BUDGET OPEN", budget);


    const [curentBudget, setCurentBudget] = React.useState<TransactionMonthInterface>(budget);
    const [modalVisible, setModalVisible] = useState(false);
    const [curentOperations, setCurentOperations] = useState<{
        income: SimpleTransactionInterface[],
        expense: SimpleTransactionInterface[]
    }>({ income: [], expense: [] });

    useEffect(() => {
        UpdateView();
    }, [budget]);





    const UpdateView = useCallback(() => {


        setCurentBudget(budget);
        if (budget.transaction) {
            setCurentOperations({
                income: OperationArrayAlphabetizeOrder([...budget.transaction.income]),
                expense: OperationArrayAlphabetizeOrder([...budget.transaction.expense])
            });
        }


    }, [budget]);

    if (!budget) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text
                    style={[globalStyle.colorTextPrimary, globalStyle.textAlignCenter, globalStyle.textSizeLarge]}
                >Aucune Operation est attribuiez à ce budget </Text>
            </View>)
    }

    return (

        <CustomSafeAreaView>



            <View style={
                [
                    styles2.centenaire,
                    {
                        backgroundColor: getColorBudget(curentBudget.montant, curentBudget.start_montant)
                    }
                ]
            }
            >
                <Text
                    style={styles2.title}
                >
                    {curentBudget.montant}€
                </Text>
                <Text style={styles2.title}>{textSizeFixe(curentBudget.name, 20)}</Text>
                <Icon
                    name="plus"
                    type="font-awesome"
                    size={20}
                    color="#000"
                    onPress={() => {
                        setModalVisible(true);
                    }}

                    style={styles2.icon}

                />
                <ModalAddExpend
                    budget={curentBudget}
                    isVisible={modalVisible}
                    setIsVisible={setModalVisible}

                />
            </View>
            <View>
                <Input
                    style={[
                        globalStyle.colorTextPrimary,
                    ]}
                    placeholder="Rechercher"
                    onChangeText={(text) => {
                        if (text.length >= 3 && budget.transaction) {

                            const newOperations = rechercheExpendByName({
                                recherche: text,
                                income: budget.transaction?.income,
                                expense: budget.transaction?.expense,
                            })

                            setCurentOperations({
                                income: newOperations.income,
                                expense: newOperations.expense
                            });

                        } else if (text.length <= 0 && budget.transaction) {

                            setCurentOperations({
                                income: OperationArrayAlphabetizeOrder([...budget.transaction.income]),
                                expense: OperationArrayAlphabetizeOrder([...budget.transaction.expense])
                            });

                        }
                    }}

                    rightIcon={
                        <Icon
                            name="search"
                            size={27}
                            color="#ffffff"

                        />
                    }

                />
            </View>
            <ScrollView >
                {curentBudget.transaction &&
                    <>
                        <Text style={[globalStyle.colorTextPrimary, globalStyle.textAlignLeft, globalStyle.textSizeMedium, globalStyle.marginVertical]}>
                            Nombre de sortie :   {curentBudget.transaction?.expense.length}
                        </Text>
                        <GenerateListeComponentsItemExpend listeExpend={curentOperations.expense} idBudget={curentBudget.id} isFilter={true} />

                        <Text style={[globalStyle.colorTextPrimary, globalStyle.textAlignLeft, globalStyle.textSizeMedium, globalStyle.marginVertical]}>
                            Nombre de entrées :   {curentBudget.transaction?.income.length}
                        </Text>
                        <GenerateListeComponentsItemExpend listeExpend={curentOperations.income} idBudget={curentBudget.id} isFilter={true} />

                    </>

                }


                <View style={styles.container} ></View>

            </ScrollView>

        </CustomSafeAreaView >

    );

}

const styles = StyleSheet.create({
    scrollView: {

        justifyContent: 'flex-start',
        alignItems: "center",
        minHeight: "100%",
        maxWidth: "100%",
        paddingTop: 20,

    },
    container: {

        justifyContent: "center",
        alignItems: "center"
    }, title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
        lineHeight: 30,

    }

});


const styles2 = StyleSheet.create({
    centenaire: {
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
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff"
    },
    icon: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 50,
        width: 40,
        height: 40,
        borderWidth: 1,
        overflow: 'hidden',
    }
});

interface GenerateListeComponentsItemExpendProps {
    listeExpend: SimpleTransactionInterface[],


    idBudget: number
    isFilter?: boolean
}


export function GenerateListeComponentsItemExpend({ listeExpend, idBudget, isFilter }: GenerateListeComponentsItemExpendProps) {

    const [NewListeExpend, setNewListeExpend] = React.useState<SimpleTransactionInterface[]>(listeExpend);
    const budget: TransactionMonthInterface = useSelector((state: any) => state.compte.curentBudget);
    useEffect(() => {

        setNewListeExpend(/* ExpendArrayAlphabetizeOrder([...listeExpend]) */ listeExpend);

    }, [listeExpend]);



    return (
        <>

            {
                NewListeExpend.length > 0 ?
                    NewListeExpend.map((item, index) => {
                        return (
                            <ItemBudget
                                key={item.id + "-" + index + "-NewListeExpend"}

                                operation={item}
                                budget={budget}
                            />

                        )
                    })
                    : <Text style={{ textAlign: "center" }}>Vous n'avez pas encore d'éléments dans ce budget</Text>

            }

        </>
    )




}




