import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSelector } from 'react-redux';
import { Icon } from "@rneui/base";
import { textSizeFixe } from "../../utils/TextManipulation";
import { SimpleTransactionInterface, TransactionMonthInterface } from "../../redux/comptesSlice";
import globalStyle from "../../assets/styleSheet/globalStyle";
import { getColorBudget } from "../../utils/ColorCollection";
import { ModalAddExpend } from "./components/ModalAddExpend/ModalAddOperation";
import { CustomSafeAreaView } from "../../components";
import { OperationArrayAlphabetizeOrder } from "./components/Search/logic";
import { Search } from "./components/Search/Search";
import { Filters } from "./components/Filters/Filters";
import OperationItems from "./components/OperationItems/OperationItems";




export const AddOperationInTheBudget = () => {

    const budget: TransactionMonthInterface = useSelector((state: any) => state.compte.curentBudget);
    const [curentBudget, setCurentBudget] = React.useState<TransactionMonthInterface>(budget);
    const [modalVisible, setModalVisible] = useState(false);
    const [filters, setFilters] = useState<"All" | "Income" | "Expense">("All");


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
            <Search
                budget={curentBudget}
                onSearch={({ income, expense }) => {

                    setCurentOperations({ income, expense });

                }}

            />
            <Filters
                onChanges={(value) => {
                    setFilters(value);

                }}

            />
            <ScrollView >
                {curentBudget.transaction &&
                    <>
                        {
                            filters === "All" || filters == "Expense" ?
                                <View>
                                    <Text style={[globalStyle.colorTextPrimary, globalStyle.textAlignLeft, globalStyle.textSizeMedium, globalStyle.marginVertical]}>
                                        Nombre de sortie :   {curentBudget.transaction?.expense.length}
                                    </Text>
                                    <OperationItems listeExpend={curentOperations.expense} idBudget={curentBudget.id} />
                                </View> : null}

                        {
                            filters === "All" || filters == "Income" ?
                                <View>
                                    <Text style={[globalStyle.colorTextPrimary, globalStyle.textAlignLeft, globalStyle.textSizeMedium, globalStyle.marginVertical]}>
                                        Nombre de entrées :   {curentBudget.transaction?.income.length}
                                    </Text>
                                    <OperationItems listeExpend={curentOperations.income} idBudget={curentBudget.id} />
                                </View> : null}
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





