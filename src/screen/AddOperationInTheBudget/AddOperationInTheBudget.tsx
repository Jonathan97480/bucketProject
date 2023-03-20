import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from "@rneui/base";
import { textSizeFixe } from "../../utils/TextManipulation";
import { setCurentCompte, setCurentMonth, SimpleTransactionInterface, TransactionMonthInterface, setCurentBudget } from "../../redux/comptesSlice";
import globalStyle from "../../assets/styleSheet/globalStyle";
import { getColorBudget } from "../../utils/ColorCollection";
import { ModalAddExpend } from "./components/ModalAddExpend/ModalAddOperation";
import { CustomSafeAreaView } from "../../components";
import { OperationArrayAlphabetizeOrder } from "./components/Search/logic";
import { Search } from "./components/Search/Search";
import { Filters } from "./components/Filters/Filters";
import OperationItems from "./components/OperationItems/OperationItems";
import ModalCreateListe from "./components/ModalCreateListe/ModalCreateListe";
import { deleteOperation } from "./components/OperationItems/logic";
import { OperationInfoModal } from "./components/OperationInfoModal/OperationInfoModal";




export const AddOperationInTheBudget = () => {

    const dispatch = useDispatch();

    const budget: TransactionMonthInterface = useSelector((state: any) => state.compte.curentBudget);
    const CurentCompte = useSelector((state: any) => state.compte.currentCompte);
    const CurentMonth = useSelector((state: any) => state.compte.currentMonth);

    const [localCurentBudget, setLocalCurentBudget] = React.useState<TransactionMonthInterface>(budget);
    const [curentOperation, setCurentOperation] = useState<SimpleTransactionInterface | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);

    const [filters, setFilters] = useState<"All" | "Income" | "Expense">("All");


    const [curentOperations, setCurentOperations] = useState<{

        income: SimpleTransactionInterface[],
        expense: SimpleTransactionInterface[]
    }>({ income: [], expense: [] });

    useEffect(() => {
        UpdateView();
    }, [budget]);


    const deleteOperationCallBack = useCallback(async (operation: SimpleTransactionInterface) => {

        deleteOperation({
            compte: CurentCompte,
            month: CurentMonth,
            budget: budget,
            operation: operation,
        }).then((res) => {

            dispatch(setCurentBudget(res.budget));
            dispatch(setCurentCompte(res.compte));
            dispatch(setCurentMonth(res.month));
            setModalVisible(false);

        }).catch((err) => {
            console.error("ERROR DELETED OPERATION", err);
        });

    }, [budget]);


    const UpdateView = useCallback(() => {


        setLocalCurentBudget(budget);
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
                        backgroundColor: getColorBudget(localCurentBudget.montant, localCurentBudget.start_montant)
                    }
                ]
            }
            >
                <Text
                    style={styles2.title}
                >
                    {localCurentBudget.montant.toFixed(2)}€
                </Text>
                <Text style={styles2.title}>{textSizeFixe(localCurentBudget.name, 20)}</Text>
                <View
                    style={styles.containerIcon}
                >
                    <Icon
                        name="plus"
                        type="font-awesome"
                        style={{
                            backgroundColor: "#4F94BB",
                            padding: 8,
                            borderRadius: 25,
                            width: 30,
                            height: 30,
                        }}
                        size={15}
                        color="#fff"
                        onPress={() => {
                            setModalVisible(true);
                        }}



                    />
                    <Icon
                        name="list"
                        type="font-awesome"
                        style={{
                            backgroundColor: "#4F94BB",
                            padding: 8,
                            borderRadius: 25,
                            width: 30,
                            height: 30,
                        }}
                        size={25}
                        color="#fff"
                        onPress={() => {
                            setModalVisible2(true);
                        }}
                    />
                </View>


                <ModalAddExpend
                    budget={budget}
                    isVisible={modalVisible}
                    setIsVisible={setModalVisible}

                />
                <ModalCreateListe
                    budget={budget}
                    isVisible={modalVisible2}
                    setIsVisible={setModalVisible2}


                />

            </View>
            <Search
                budget={localCurentBudget}
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
                {localCurentBudget.transaction &&
                    <>
                        {
                            filters === "All" || filters == "Expense" ?
                                <View>
                                    <Text style={[globalStyle.colorTextPrimary, globalStyle.textAlignLeft, globalStyle.textSizeMedium, globalStyle.marginVertical]}>
                                        Nombre de sortie :   {localCurentBudget.transaction?.expense.length}
                                    </Text>
                                    <OperationItems listeExpend={curentOperations.expense}
                                        deleteCallBack={deleteOperationCallBack}
                                        infoPanelOpen={(operation) => {
                                            setCurentOperation(operation);

                                        }}
                                    />
                                </View> : null}

                        {
                            filters === "All" || filters == "Income" ?
                                <View>
                                    <Text style={[globalStyle.colorTextPrimary, globalStyle.textAlignLeft, globalStyle.textSizeMedium, globalStyle.marginVertical]}>
                                        Nombre de entrées :   {localCurentBudget.transaction?.income.length}
                                    </Text>
                                    <OperationItems listeExpend={curentOperations.income}

                                        deleteCallBack={deleteOperationCallBack}
                                        infoPanelOpen={(operation) => {
                                            setCurentOperation(operation);

                                        }}
                                    />
                                </View> : null}
                    </>

                }


                <View style={styles.container} ></View>

            </ScrollView>
            <OperationInfoModal
                isModalVisible={curentOperation != null}
                setIsModalVisible={() => setCurentOperation(null)}
                operation={curentOperation!}
                budget={budget}
                callbackDeleteBtn={() => {
                    deleteOperationCallBack(curentOperation!);

                }}


            />
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

    },
    containerIcon: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: 70,
    }

});


const styles2 = StyleSheet.create({
    centenaire: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingVertical: 15,
        backgroundColor: "#fff",
        marginBottom: 20,
        borderRadius: 20,

    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff"
    },

});






