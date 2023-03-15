import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Modal } from "react-native";
import styleSheet from "./styleSheet";
import { Input, Button } from "@rneui/themed/";
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { CompteInterface, setCurentBudget, setCurentCompte, setCurentMonth, SimpleTransactionInterface, TransactionMonthInterface } from "../../../redux/comptesSlice";
import { checkForm, createNewOperation, FormAddOperationInterface, resetForm, returnDefaultValueForm, saveOperation } from "./logic";
import { CategoryInterface } from "../../../redux/categorySlice";



interface ModalAddExpendProps {
    isVisible: boolean,
    budget: TransactionMonthInterface,
    setIsVisible: (value: boolean) => void,
    CurrentOperation?: SimpleTransactionInterface | null | undefined,

}



export const ModalAddExpend = ({ isVisible, budget, setIsVisible, CurrentOperation }: ModalAddExpendProps) => {


    const [actionType, setActionType] = useState<"income" | "expense">("income");
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
    }, []);

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={
                () => {

                    setIsVisible(false);
                }
            }

        >
            <View style={styleSheet.modal}>
                <View style={styleSheet.View}>
                    <View style={styleSheet.TitleBlock}>
                        <Text style={actionType === "income" ? styleSheet.title : styleSheet.titleActive}
                            onPress={() => {
                                setActionType("expense");
                                setFormOperation({
                                    ...formOperation,
                                    type: "expense",
                                });

                            }}
                        >Sortie</Text>
                        <Text style={actionType === "expense" ? styleSheet.title : styleSheet.titleActive}
                            onPress={() => {
                                setActionType("income");
                                setFormOperation({
                                    ...formOperation,
                                    type: "income",
                                });
                            }}
                        >Entrée</Text>

                    </View>

                    <Input
                        placeholder={`nom du ${actionType === "income" ? " Entrée" : " Sortie"}`}
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
                        placeholder={`montant du ${actionType === "income" ? " Entrée" : " Sortie"}`}
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
                        value={formOperation.quantity}
                        onChangeText={(value) => {
                            checkForm({
                                form: { ...formOperation, quantity: value },
                                setFormOperation: setFormOperation,

                            });
                        }}
                    />
                    < View >

                        <Picker

                            selectedValue={formOperation.category}
                            style={{ height: 50, width: "100%", marginBottom: 20 }}
                            onValueChange={(itemValue, itemIndex) => {
                                checkForm({
                                    form: { ...formOperation, category: itemValue },
                                    setFormOperation: setFormOperation,

                                });
                            }}
                        >
                            {
                                curentCategory.map((item, index) => {

                                    return (
                                        <Picker.Item label={item.name} value={item.id} key={`indexKey-cat-${index}`} />
                                    )
                                })
                            }

                        </Picker>
                    </View>
                    <Button
                        radius={5}
                        disabled={formOperation.btnEnabled}
                        title={CurrentOperation ? "Sauvegarder les modifications" : "Ajouter l'operation"}
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
                                dispatch(setCurentCompte(res?.compte));
                                dispatch(setCurentMonth(res?.month));
                                dispatch(setCurentBudget(res?.budget))


                                closeModal();
                            }).catch((err) => {
                                console.log(err);
                            })


                        }}
                    />
                </View>
            </View>
        </Modal >
    )


    function closeModal() {
        setFormOperation(resetForm());
        setIsVisible(false);
    }






}

