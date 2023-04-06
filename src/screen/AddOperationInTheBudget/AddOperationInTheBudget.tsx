import React, { useCallback, useEffect, useState, useReducer } from "react";
import { View, Text, Modal } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { Button, FAB, Icon } from "@rneui/base";

import { setCurentCompte, setCurentMonth, SimpleTransactionInterface, TransactionMonthInterface, setCurentBudget, CompteInterface, MonthInterface } from "../../redux/comptesSlice";
import globalStyle from "../../assets/styleSheet/globalStyle";
import { getColorBudget } from "../../utils/ColorCollection";
import { ModalAddExpend } from "./components/ModalAddExpend/ModalAddOperation";
import { BannerAds, CustomModal, CustomSafeAreaView } from "../../components";
import { OperationArrayAlphabetizeOrder } from "./components/Search/logic";
import { Search } from "./components/Search/Search";
import { Filters } from "./components/Filters/Filters";
import OperationItems from "./components/OperationItems/OperationItems";
import ModalCreateListe from "./components/ModalCreateListe/ModalCreateListe";
import { deleteOperation } from "./components/OperationItems/logic";
import { OperationInfoModal } from "./components/OperationInfoModal/OperationInfoModal";
import styleSheet from "./styleSheet";
import { CloseBudget } from "./logic";
import { getTrad } from "../../lang/internationalization";



export const AddOperationInTheBudget = () => {

    const dispatch = useDispatch();


    const budget: TransactionMonthInterface = useSelector((state: any) => state.compte.curentBudget);
    const CurentCompte = useSelector((state: any) => state.compte.currentCompte);
    const CurentMonth = useSelector((state: any) => state.compte.currentMonth);
    const [curentOperation, setCurentOperation] = useState<SimpleTransactionInterface | null>(null);




    const reducerModal = (
        state: "close" | "addOperation" | "createListe" | "infoOperation" | "closeBudget",
        action: { type: "close" | "addOperation" | "createListe" | "infoOperation" | "closeBudget", operation?: SimpleTransactionInterface }
    ): "close" | "addOperation" | "createListe" | "infoOperation" | "closeBudget" => {

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
            case "closeBudget":

                return "closeBudget";
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
                >{getTrad("NoOperationAllocatedBudget")}</Text>
            </View>)
    }

    return (

        <CustomSafeAreaView>
            <BannerAds />
            <Header
                localCurentBudget={budget}
                dispatchModalVisible={dispatchModalVisible}

            />


            {budget.transaction &&
                <View style={{
                    flex: 1,

                }}>
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
                    {
                        filters == "Expense" ?
                            <View>
                                <Text style={[globalStyle.colorTextPrimary, globalStyle.textAlignLeft, globalStyle.textSizeMedium, globalStyle.marginVertical]}>
                                    {getTrad("NumberOutputs")} : {budget.transaction?.expense.length}
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
                                    {getTrad("NumberEntries")} :   {budget.transaction?.income.length}
                                </Text>
                                <OperationItems listeExpend={curentOperations.income}

                                    deleteCallBack={deleteOperationCallBack}
                                    infoPanelOpen={(operation) => {
                                        setCurentOperation(operation);

                                    }}

                                />
                            </View> : null}
                </View>

            }


            <View style={styleSheet.container2} ></View>


            <OperationInfoModal
                isModalVisible={curentOperation !== null && modalVisible === "infoOperation"}
                setIsModalVisible={() => setCurentOperation(null)}
                isClosedBudget={budget.isClosed}
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

            <ModalCloreBudget
                budget={budget}
                compte={CurentCompte}
                month={CurentMonth}
                isVisible={modalVisible === "closeBudget"}
                setIsVisible={
                    () => {
                        dispatchModalVisible({ type: "close" });
                    }

                }


            />


            <FAB
                color={globalStyle.btnStyle.backgroundColor}
                disabled={budget.isClosed}
                icon={
                    <Icon
                        name="plus"
                        type="font-awesome-5"
                        size={25}
                        color="white"
                    />
                }
                onPress={() => {
                    dispatchModalVisible({ type: "addOperation" });
                }}
                placement="right"

            />
        </CustomSafeAreaView >

    );

}


const Header = React.memo(({ localCurentBudget, dispatchModalVisible }: {
    localCurentBudget: TransactionMonthInterface,
    dispatchModalVisible: React.Dispatch<{
        type: "close" | "addOperation" | "createListe" | "infoOperation" | "closeBudget",
        operation?: SimpleTransactionInterface,

    }>
}) => {

    const textSize = 17;

    const isNullTransaction: boolean = localCurentBudget.transaction?.expense?.length! > 0 || localCurentBudget.transaction?.income.length! > 0;
    return (
        <>
            <View style={
                {
                    backgroundColor: getColorBudget(localCurentBudget.montant, localCurentBudget.start_montant),
                    padding: 10,
                    paddingTop: 0,
                    paddingBottom: 0,
                    width: "40%",
                    borderRadius: 10,
                    alignSelf: "center",
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    marginTop: 10,
                }
            } >
                <Text

                    style={[styleSheet.title, globalStyle.textAlignCenter]}
                >

                    {localCurentBudget.montant.toFixed(2)}€
                </Text>
            </View>
            <View style={
                [{
                    backgroundColor: getColorBudget(localCurentBudget.montant, localCurentBudget.start_montant),
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 8,
                    borderRadius: 10,
                    marginBottom: 10,
                }]
            }
            >

                <Text style={styleSheet.title}>{localCurentBudget.name.substring(0, textSize)}</Text>
                <View
                    style={styleSheet.containerIcon}
                >
                    <Icon
                        disabled={localCurentBudget.isClosed || !isNullTransaction}

                        name="check"
                        type="font-awesome"
                        style={{
                            backgroundColor: localCurentBudget.isClosed || !isNullTransaction ? '#d1d5d8' : "#4F94BB",
                            padding: 8,
                            borderRadius: 25,
                            width: 30,
                            height: 30,
                        }}
                        size={15}
                        color="#fff"
                        onPress={() => {

                            dispatchModalVisible({ type: "closeBudget" });
                        }}



                    />
                    <Icon
                        disabled={localCurentBudget.isClosed || !isNullTransaction}
                        name="list"
                        type="font-awesome"
                        style={{
                            backgroundColor: localCurentBudget.isClosed || !isNullTransaction ? '#d1d5d8' : "#4F94BB",
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
        </>
    )




});




const ModalCloreBudget = React.memo((props: { isVisible: boolean, setIsVisible: () => void, budget: TransactionMonthInterface, compte: CompteInterface, month: MonthInterface }) => {

    const dispatch = useDispatch();

    return (
        <CustomModal
            visible={props.isVisible}
            animationType="slide"
            transparent={true}
            setIsVisible={() => props.setIsVisible()}
        >

            <View
                style={{ width: "100%", }}
            >
                <Text
                    style={[
                        globalStyle.textSizeLarge,
                        globalStyle.textAlignCenter,
                        { marginBottom: 10 }
                    ]}
                >
                    {getTrad("CloseTheBudget")}
                </Text>
                <Text
                    style={[
                        globalStyle.textSizeMedium,
                        globalStyle.textAlignCenter,
                        { marginBottom: 10 }
                    ]}
                >Voulez vous vraiment fermer ce budget ?</Text>
                <Text
                    style={[
                        globalStyle.textSizeSmall,
                        globalStyle.textAlignCenter,
                        { marginBottom: 10 }
                    ]}
                >{getTrad("closeBudgetMessage")}</Text>
                <Text
                    style={[
                        globalStyle.textSizeSmall,
                        globalStyle.textAlignCenter,
                        { marginBottom: 10, color: "#FF0000" }
                    ]}
                >{getTrad("closeBudgetWarning")}</Text>
                <View>
                    <Button
                        radius={25}
                        buttonStyle={globalStyle.btnStyle}
                        title={getTrad("CloseTheBudget")}
                        onPress={() => {
                            CloseBudget({
                                budget: props.budget,
                                compte: props.compte,
                                month: props.month
                            }).then((res) => {

                                if (res) {
                                    dispatch(setCurentCompte(res.compte));
                                    dispatch(setCurentBudget(res.budget));
                                    dispatch(setCurentMonth(res.month));
                                    props.setIsVisible();
                                }
                            })

                        }}
                        iconPosition="right"
                        icon={

                            <Icon
                                style={{ marginLeft: 10 }}
                                name="check"
                                type="font-awesome"
                                size={15}
                                color="#fff"
                            />
                        }
                    />

                    <Button
                        radius={25}
                        buttonStyle={[globalStyle.btnStyle, { backgroundColor: "#FF0000" }]}
                        title={getTrad("cancel")}
                        onPress={() => {

                            props.setIsVisible();


                        }}
                        iconPosition="right"
                        icon={
                            <Icon
                                style={{ marginLeft: 10 }}
                                name="times"
                                type="font-awesome"
                                size={15}
                                color="#fff"
                            />

                        }
                    />

                </View>
            </View>

        </CustomModal >


    )



})



