import React, { useCallback, useEffect, useState, useReducer } from "react";
import { View, Text, ScrollView } from "react-native";
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
import styleSheet from "./styleSheet";




export const AddOperationInTheBudget = () => {

    const dispatch = useDispatch();


    const budget: TransactionMonthInterface = useSelector((state: any) => state.compte.curentBudget);
    const CurentCompte = useSelector((state: any) => state.compte.currentCompte);
    const CurentMonth = useSelector((state: any) => state.compte.currentMonth);
    const [curentOperation, setCurentOperation] = useState<SimpleTransactionInterface | null>(null);




    const reducerModal = (
        state: "close" | "addOperation" | "createListe" | "infoOperation",
        action: { type: "close" | "addOperation" | "createListe" | "infoOperation", operation?: SimpleTransactionInterface }
    ) => {

        switch (action.type) {
            case "close":
                return "close";
            case "addOperation":
                setCurentOperation(action.operation ? action.operation : null);
                return "addOperation";

            case "createListe":
                return "createListe";
            case "infoOperation":
                setCurentOperation(action.operation!);
                return "infoOperation";
            default:
                throw new Error("la modal " + action.type + " nexists  pas ");
        }



    };

    const [modalVisible, dispatchModalVisible] = useReducer(reducerModal, "close");

    const [filters, setFilters] = useState<"Income" | "Expense">("Expense");


    const [curentOperations, setCurentOperations] = useState<{

        income: SimpleTransactionInterface[],
        expense: SimpleTransactionInterface[]
    }>({ income: [], expense: [] });

    useEffect(() => {

        if (!budget.transaction) return;
        setCurentOperations({
            income: OperationArrayAlphabetizeOrder([...budget.transaction.income]),
            expense: OperationArrayAlphabetizeOrder([...budget.transaction.expense])
        });

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
            dispatchModalVisible({ type: "close" });

        }).catch((err) => {
            console.error("UNE ERREUR EST SURVENU LORE DE LA SUPPRESSION DE L'OPERATION", err);
        });

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

            <Header
                localCurentBudget={budget}
                dispatchModalVisible={dispatchModalVisible}
            />
            <Search
                budget={budget}
                onSearch={({ income, expense }) => {

                    setCurentOperations({ income, expense });

                }}

            />
            <Filters
                onChanges={(value) => {
                    setFilters(value);

                }}

            />

            {budget.transaction &&
                <>
                    {
                        filters == "Expense" ?
                            <View>
                                <Text style={[globalStyle.colorTextPrimary, globalStyle.textAlignLeft, globalStyle.textSizeMedium, globalStyle.marginVertical]}>
                                    Nombre de sortie :   {budget.transaction?.expense.length}
                                </Text>
                                <OperationItems listeExpend={curentOperations.expense}
                                    deleteCallBack={deleteOperationCallBack}
                                    infoPanelOpen={(operation) => {

                                        dispatchModalVisible({ type: "infoOperation", operation: operation });

                                    }}
                                />
                            </View> : null}

                    {
                        filters == "Income" ?
                            <View>
                                <Text style={[globalStyle.colorTextPrimary, globalStyle.textAlignLeft, globalStyle.textSizeMedium, globalStyle.marginVertical]}>
                                    Nombre de entrées :   {budget.transaction?.income.length}
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


            <View style={styleSheet.container2} ></View>


            <OperationInfoModal
                isModalVisible={curentOperation !== null && modalVisible === "infoOperation"}
                setIsModalVisible={() => setCurentOperation(null)}
                operation={curentOperation!}
                budget={budget}
                callbackDeleteBtn={() => {
                    deleteOperationCallBack(curentOperation!);

                }}

                callbackEditBtn={() => {
                    dispatchModalVisible({ type: "addOperation", operation: curentOperation! });


                }}


            />
            <ModalAddExpend
                budget={budget}
                isVisible={modalVisible === "addOperation"}
                setIsVisible={() => {
                    dispatchModalVisible({ type: "close" });
                }}
                CurrentOperation={curentOperation}

            />
            <ModalCreateListe
                budget={budget}
                isVisible={modalVisible === "createListe"}
                setIsVisible={
                    () => {
                        dispatchModalVisible({ type: "close" });
                    }
                }


            />
        </CustomSafeAreaView >

    );

}


const Header = React.memo(({ localCurentBudget, dispatchModalVisible }: {
    localCurentBudget: TransactionMonthInterface,
    dispatchModalVisible: React.Dispatch<{ type: "close" | "addOperation" | "createListe" | "infoOperation", operation?: SimpleTransactionInterface }>
}) => {

    const textSize = 20;

    return (
        <View style={
            [
                styleSheet.centenaire,
                {
                    backgroundColor: getColorBudget(localCurentBudget.montant, localCurentBudget.start_montant)
                }
            ]
        }
        >
            <Text
                style={styleSheet.title}
            >
                {localCurentBudget.montant.toFixed(2)}€
            </Text>
            <Text style={styleSheet.title}>{localCurentBudget.name.substring(0, textSize)}</Text>
            <View
                style={styleSheet.containerIcon}
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

                        dispatchModalVisible({ type: "addOperation" });
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
                        dispatchModalVisible({ type: "createListe" });
                    }}
                />
            </View>




        </View>
    )




});






