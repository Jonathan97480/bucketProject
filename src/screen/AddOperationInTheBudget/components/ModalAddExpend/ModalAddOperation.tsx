import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Modal, Alert } from "react-native";
import styleSheet from "./styleSheet";
import { Input, Button } from "@rneui/themed/";

import { useSelector, useDispatch } from 'react-redux';
import { CompteInterface, setCurentBudget, setCurentCompte, setCurentMonth, SimpleTransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import { checkForm, createNewOperation, FormAddOperationInterface, resetForm, returnDefaultValueForm, saveOperation } from "./logic";
import { CategoryInterface } from "../../../../redux/categorySlice";
import { CustomModal } from "../../../../components";
import { getTrad } from "../../../../lang/internationalization";



interface ModalAddExpendProps {
    isVisible: boolean,
    budget: TransactionMonthInterface,
    setIsVisible: (value: boolean) => void,
    CurrentOperation?: SimpleTransactionInterface | null | undefined,

}



export const ModalAddExpend = ({ isVisible, budget, setIsVisible, CurrentOperation }: ModalAddExpendProps) => {


    const [actionType, setActionType] = useState<"income" | "expense">("expense");
    const dispatch = useDispatch();
    const currentCompte: CompteInterface = useSelector((state: any) => state.compte.currentCompte);
    const curentMonth = useSelector((state: any) => state.compte.currentMonth);
    const curentCategory: CategoryInterface[] = useSelector((state: any) => state.category.category);
    const [formOperation, setFormOperation] = useState<FormAddOperationInterface>(resetForm());




    useEffect(() => {


        checkFormCallBack(CurrentOperation);




    }, [CurrentOperation]);


    const checkFormCallBack = useCallback((_currentOperation: SimpleTransactionInterface | null | undefined) => {

        if (CurrentOperation) {


            setActionType(CurrentOperation.type);
            setFormOperation(returnDefaultValueForm(CurrentOperation));

        } else {
            setFormOperation(resetForm());
            setActionType(resetForm().type);
        }
    }, [CurrentOperation]);

    return (
        <CustomModal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            setIsVisible={() => setIsVisible(false)}

        >

            <View style={styleSheet.View}>
                <View style={styleSheet.TitleBlock}>
                    <Text style={actionType === "income" ? styleSheet.title : styleSheet.titleActive}
                        onPress={() => {
                            setActionType("expense");
                            checkForm({
                                form: { ...formOperation, type: "expense" },
                                setFormOperation: setFormOperation,
                            })


                        }}
                    >{getTrad("Output")}</Text>
                    <Text style={actionType === "expense" ? styleSheet.title : styleSheet.titleActive}
                        onPress={() => {
                            setActionType("income");
                            checkForm({
                                form: { ...formOperation, type: "income" },
                                setFormOperation: setFormOperation,
                            })
                        }}
                    >{getTrad("Entrance")}</Text>

                </View>

                <Input
                    placeholder={getTrad("NameOf") + ` ${actionType === "income" ? getTrad("TheEntrance") : getTrad("TheOutput")}`}
                    value={formOperation.title}
                    onChangeText={(value) => {
                        checkForm({
                            form: { ...formOperation, title: value },
                            setFormOperation: setFormOperation,

                        });

                    }}
                    errorMessage={formOperation.errorTitle}
                />
                <Input
                    keyboardType="numeric"
                    placeholder={getTrad("AmountOf") + ` ${actionType === "income" ? getTrad("TheEntrance") : getTrad("TheOutput")
                        }`}
                    value={formOperation.montant}
                    onChangeText={(value) => {
                        checkForm({
                            form: { ...formOperation, montant: value },
                            setFormOperation: setFormOperation,

                        });
                    }}
                    errorMessage={formOperation.errorMontant}
                />
                <Input
                    keyboardType="numeric"
                    placeholder={"Quantité"}
                    errorMessage={formOperation.errorQuantity}
                    value={formOperation.quantity}
                    onChangeText={(value) => {
                        checkForm({
                            form: { ...formOperation, quantity: value },
                            setFormOperation: setFormOperation,

                        });
                    }}
                />

                <Button
                    radius={25}
                    disabledStyle={{
                        backgroundColor: "rgba(156, 104, 221, 0.42)",
                    }}
                    buttonStyle={{
                        backgroundColor: "#9C68DD",
                        width: "100%",
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 10,
                    }}
                    disabled={formOperation.btnEnabled}
                    title={CurrentOperation ? getTrad("SaveChanges") : getTrad("AddOperation")}
                    onPress={() => {

                        /* Add operation */
                        saveOperation({
                            compteCurrent: currentCompte,
                            CurrentMonth: curentMonth,
                            budget: budget as TransactionMonthInterface,
                            newOperation: createNewOperation({
                                form: formOperation,
                                budget: budget

                            }),
                            oldOperation: CurrentOperation?.id ? CurrentOperation : null,
                        }).then((res) => {
                            if (!res.alert) {
                                dispatch(setCurentCompte(res?.compte));
                                dispatch(setCurentMonth(res?.month));
                                dispatch(setCurentBudget(res?.budget))
                                closeModal();
                            } else {
                                Alert.alert(
                                    res.alert.alert?.type || "Error",
                                    res.alert.alert?.message
                                );
                            }

                        }).catch((err) => {
                            console.log(err);
                        })


                    }}
                />
            </View>

        </CustomModal >
    )


    function closeModal() {
        setFormOperation(resetForm());
        setIsVisible(false);
    }






}


