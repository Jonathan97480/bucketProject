

import React, { useEffect, useState } from 'react'
import { Modal, View, Text, TouchableOpacity, Alert } from 'react-native'
import { Input, Icon, Button, CheckBox } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import styleSheet from './styleSheet';
import { Picker } from '@react-native-picker/picker';
import { CompteInterface, MonthInterface, setCurentCompte, setCurentMonth, TransactionMonthInterface } from '../../../../redux/comptesSlice';
import { addCategory, CategoryInterface } from '../../../../redux/categorySlice';
import { createNewTransaction, defineFormAddBudget, defineIDTransaction, FormAddBudget, getAllCategory, ResetForm, saveTransaction, UpdateTransaction, ValidateForm } from './logic';
import globalStyle from '../../../../assets/styleSheet/globalStyle';
import { getTrad } from '../../../../lang/internationalization';

interface ModalAddBudgetProps {
    isViewModalAddBudget: boolean,
    setIsViewModalAddBudget: (value: boolean, transaction: TransactionMonthInterface | null) => void,
    transaction?: TransactionMonthInterface | null,

}


export const ModalAddBudget = ({ isViewModalAddBudget, setIsViewModalAddBudget, transaction }: ModalAddBudgetProps) => {

    const dispatch = useDispatch();

    const categoryRedux: CategoryInterface[] = useSelector((state: any) => state.category.category);
    const currentMonthRedux: MonthInterface = useSelector((state: any) => state.compte.currentMonth);
    const currentCompteRedux: CompteInterface = useSelector((state: any) => state.compte.currentCompte);

    const [curentEtape, setCurentEtape] = useState<'Etape1' | 'Etape2' | 'Etape3'>('Etape1');

    const [formAddBudget, setFormAddBudget] = useState<FormAddBudget>(defineFormAddBudget(transaction));


    useEffect(() => {

        if (categoryRedux.length <= 0) {
            getAllCategory().then((_data) => {

                if (_data !== undefined && _data !== null && _data.length > 0) {
                    dispatch(addCategory(_data));
                }
            });


        }

        setFormAddBudget(defineFormAddBudget(transaction));

    }, [transaction, categoryRedux])


    function handleCloseModal() {

        setFormAddBudget(ResetForm())
        setCurentEtape('Etape1')
        setIsViewModalAddBudget(false, null)
    }

    const handleSaveTransaction = () => {

        /* ADD TRANSACTION  */
        if (!ValidateForm(formAddBudget, setFormAddBudget)) {
            setCurentEtape('Etape1')
            return;
        }

        const newID = defineIDTransaction(currentMonthRedux, formAddBudget.typeOperation);

        const newTransaction: TransactionMonthInterface = createNewTransaction(newID, formAddBudget)


        saveTransaction(currentCompteRedux, currentMonthRedux, newTransaction).then((res) => {
            if (!res.alert) {
                dispatch(setCurentCompte(res.compte));
                dispatch(setCurentMonth(res.month))
                handleCloseModal()
                return;
            }

            handleAlert({
                message: res.alert.message,
                action: res.alert.action,
                callBackValidate: () => {
                    res.alert.action?.valider.action().then((res) => {
                        if (!res.alert) {
                            dispatch(setCurentCompte(res.compte));
                            dispatch(setCurentMonth(res.month))
                            handleCloseModal()
                            return;
                        }
                    })
                },
                callBackDismiss: () => { },
                type: res.alert.type
            });

        }).catch((err) => { console.log(err) })
    }

    const handleSaveEditTransaction = (transaction: TransactionMonthInterface) => {

        if (transaction.isClosed) {

            handleAlert({
                message: getTrad("YouCannotModifyClosedBudget"),
                callBackValidate: () => { },
                callBackDismiss: () => { },
                type: getTrad("Attention")
            });
            return;
        }

        if (ValidateForm(formAddBudget, setFormAddBudget)) {

            let newTransaction: TransactionMonthInterface | null = null;
            /* prepare Transaction */
            if (transaction.typeOperation !== formAddBudget.typeOperation) {
                const newID = defineIDTransaction(currentMonthRedux, formAddBudget.typeOperation);
                newTransaction = createNewTransaction(newID, formAddBudget, transaction)

            } else {
                newTransaction = createNewTransaction(transaction.id, formAddBudget)

            }



            UpdateTransaction({

                oldTransaction: transaction,
                curentCompte: currentCompteRedux,
                curentMonth: currentMonthRedux,
                newTransaction: newTransaction

            }).then((res: {
                compte: CompteInterface,
                curentMonth: MonthInterface
            }) => {

                dispatch(setCurentCompte(res.compte));
                dispatch(setCurentMonth(res.curentMonth))
                handleCloseModal()

            }).catch((err) => { console.log(err) })

        } else {
            setCurentEtape('Etape1')
        }
    }

    const handleAlert = ({ message, callBackValidate, callBackDismiss, action, type }: {
        message: string,
        callBackValidate: () => void,
        callBackDismiss: () => void,
        action?: {
            valider: {
                text: string,
                action: () => void
            },
            annuler: {
                text: string,
                action: () => void
            }

        } | null,
        type: string

    }
    ) => {
        Alert.alert(
            type,
            message,
            action != null ?
                [
                    {
                        text: action.valider.text,
                        onPress: () => callBackValidate()
                    },
                    {
                        text: action.annuler.text,
                        onPress: () => callBackDismiss(),
                        style: "cancel"
                    }
                ]
                : [
                    {
                        text: "Cancel",
                        onPress: () => callBackDismiss,
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => callBackValidate }
                ],
            { cancelable: false }
        );
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isViewModalAddBudget}
            onRequestClose={() => {
                handleCloseModal();

            }}
            style={styleSheet.modal}
        >

            <View style={styleSheet.modalContainer}>


                <View style={styleSheet.modalBody}>
                    <Text style={styleSheet.titleModal}>{getTrad("AddTransaction")}</Text>
                    <View style={[globalStyle.flexRow, { width: '100%', justifyContent: 'space-between' }, globalStyle.marginVertical]} >
                        <BtnStage
                            curentStage={curentEtape}
                            setCurentStage={setCurentEtape}
                            stage="Etape1"
                            title={getTrad("Stage") + " 1"}
                        />
                        <BtnStage
                            curentStage={curentEtape}
                            setCurentStage={setCurentEtape}
                            stage="Etape2"
                            title={getTrad("Stage") + " 2"}
                        />

                        <BtnStage
                            curentStage={curentEtape}
                            setCurentStage={setCurentEtape}
                            stage="Etape3"
                            title={getTrad("Stage") + " 3"}
                        />

                    </View>
                    {
                        curentEtape === 'Etape1' &&
                        <View style={styleSheet.stageContainer}>
                            <View>
                                <Text style={styleSheet.modalInputLabel}>{getTrad("name")} :</Text>
                                <Input placeholder={getTrad("NameYourTransaction")}
                                    errorMessage={formAddBudget.errorName}
                                    value={formAddBudget.name}
                                    onChangeText={(value) => {
                                        setFormAddBudget({ ...formAddBudget, name: value });
                                    }}
                                />
                            </View>
                            <View>
                                <Text style={styleSheet.modalInputLabel}>{getTrad("Amount")} :</Text>
                                <Input placeholder={getTrad("AmountYourTransaction")}
                                    keyboardType="numeric"
                                    errorMessage={formAddBudget.errorMontant}
                                    value={formAddBudget.montant}
                                    onChangeText={(value) => {
                                        setFormAddBudget({ ...formAddBudget, montant: value });
                                    }}
                                />
                            </View>
                        </View>}
                    {
                        curentEtape === 'Etape2' &&
                        <View style={styleSheet.stageContainer}>
                            <View>
                                <Text style={styleSheet.modalInputLabel}>{getTrad("TransactionType")}</Text>
                                <View style={[globalStyle.flexRow]}>
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, typeTransaction: 'Spent' });
                                        }}
                                        title={getTrad("Operation")}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={formAddBudget.typeTransaction === 'Spent' ? true : false}
                                    />
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, typeTransaction: 'Budget' });
                                        }}
                                        title={getTrad("Budget")}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={formAddBudget.typeTransaction === 'Budget' ? true : false}
                                    />
                                </View>


                            </View >
                            <View>
                                <Text style={styleSheet.modalInputLabel}>{getTrad("TransactionType")}</Text>
                                <View style={[globalStyle.flexRow]}>
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, typeOperation: 'income' });
                                        }}
                                        title={getTrad("Deposit")}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={formAddBudget.typeOperation === 'income' ? true : false}
                                    />
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, typeOperation: 'expense' });
                                        }}
                                        title={getTrad("Withdrawal")}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={formAddBudget.typeOperation === 'expense' ? true : false}
                                    />
                                </View>


                            </View>
                        </View>}
                    {
                        curentEtape === 'Etape3' &&
                        <View style={styleSheet.stageContainer}>
                            <View>
                                <Text style={styleSheet.modalInputLabel}>{getTrad("IsOperationUnique")}</Text>
                                <View style={[globalStyle.flexRow]}>
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, isUnique: true });
                                        }}
                                        title={getTrad("yes")}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={formAddBudget.isUnique ? true : false}
                                    />
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, isUnique: false });
                                        }}
                                        title={getTrad("no")}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={!formAddBudget.isUnique ? true : false}
                                    />
                                </View>
                            </View>

                            {
                                !formAddBudget.isUnique &&
                                <View>
                                    <Text style={styleSheet.modalInputLabel}>{getTrad("theOperationRepeatedEvery")}</Text>
                                    <View style={[globalStyle.flexRow]}>

                                        <CheckBox
                                            onPress={() => {
                                                setFormAddBudget({ ...formAddBudget, period: 'month' });
                                            }}
                                            title={getTrad("months")}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checked={formAddBudget.period == "month" ? true : false}
                                        />
                                        <CheckBox
                                            onPress={() => {
                                                setFormAddBudget({ ...formAddBudget, period: 'year' });
                                            }}
                                            title={getTrad("years")}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checked={formAddBudget.period == "year" ? true : false}
                                        />
                                    </View>
                                </View>
                            }


                            <View>
                                <Text style={styleSheet.modalInputLabel}>{getTrad("TransactionCategory")}</Text>
                                <Picker
                                    selectedValue={formAddBudget.categoryTransaction}
                                    onValueChange={(itemValue: number, itemIndex: number) => {
                                        setFormAddBudget({ ...formAddBudget, categoryTransaction: itemValue });
                                    }}
                                >
                                    {categoryRedux.map((category, index) => {

                                        return (
                                            <Picker.Item key={'pickCategory-' + index} label={category.name} value={category.id} />
                                        )
                                    })}
                                </Picker>
                            </View>

                        </View>}

                    <BtnNextStage
                        curentStage={curentEtape}
                        setCurentStage={setCurentEtape}
                        handleSaveEditTransaction={handleSaveEditTransaction}
                        handleSaveTransaction={() => handleSaveTransaction()}
                        transaction={transaction}

                    />

                </View>
            </View>


        </Modal >
    );


}



const BtnStage = React.memo(({ curentStage, setCurentStage, stage, title }: { curentStage: string, setCurentStage: Function, stage: string, title: string }) => {

    const colors = {
        enabled: '#817FE5',
        disabled: 'rgba(129, 127, 229, 0.26)'
    }


    return (
        <TouchableOpacity
            onPress={() => {
                setCurentStage(stage);

            }}
        >
            <Text style={[styleSheet.modalInputLabel, {
                color: curentStage === stage ? colors.enabled : colors.disabled
            }]}>{title}</Text>
        </TouchableOpacity>
    )


})


const BtnNextStage = React.memo(({ curentStage, setCurentStage, handleSaveEditTransaction, handleSaveTransaction, transaction }: { curentStage: string, setCurentStage: Function, handleSaveTransaction: () => void, handleSaveEditTransaction: (value: TransactionMonthInterface) => void, transaction: TransactionMonthInterface | undefined | null }) => {

    return (
        <>
            {
                curentStage !== 'Etape3' ?
                    <Button
                        title={getTrad("Next")}
                        radius={25}
                        style={globalStyle.btnStyle}
                        onPress={() => {
                            switch (curentStage) {
                                case 'Etape1':
                                    setCurentStage('Etape2')
                                    break;
                                case 'Etape2':
                                    setCurentStage('Etape3')
                                    break;
                                default:
                                    break;
                            }
                        }}
                        icon={
                            <Icon
                                name="arrow-right"
                                size={15}
                                color="white"
                                type='font-awesome'
                                style={{ marginLeft: 10 }}


                            />
                        }
                        iconPosition="right"
                        color="#841584"


                    /> : <BtnSaveTransaction
                        handleSaveTransaction={() => handleSaveTransaction()}
                        handleSaveEditTransaction={(v) => handleSaveEditTransaction(v)}
                        transaction={transaction}

                    />
            }
        </>
    )

})

const BtnSaveTransaction = React.memo(({ handleSaveTransaction, handleSaveEditTransaction, transaction }: { handleSaveTransaction: () => void, handleSaveEditTransaction: (value: TransactionMonthInterface) => void, transaction?: TransactionMonthInterface | undefined | null }) => {


    return (
        <Button
            color={"#817FE5"}
            radius={25}
            disabledStyle={{ backgroundColor: "rgba(129, 127, 229, 0.26)" }}
            style={globalStyle.btnStyle}
            title={transaction ? getTrad("Save") : getTrad("Add")}
            onPress={() => {

                if (!transaction) {
                    /* ADD TRANSACTION  */

                    handleSaveTransaction();

                } else {
                    /* EDIT TRANSACTION  */

                    handleSaveEditTransaction(transaction)
                }
            }
            }
            icon={
                <Icon
                    name="check"
                    size={15}
                    color="white"
                    style={{ marginLeft: 10 }}
                    type='font-awesome'

                />
            }
            iconPosition="right"

        />
    )


})



