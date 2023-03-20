

import React, { useEffect, useState } from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native'
import { Input, Icon, Button, CheckBox } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import styleSheet from './styleSheet';
import { Picker } from '@react-native-picker/picker';
import { PoleExpend } from '../../../../redux/expendSlice';
import { CompteInterface, MonthInterface, setCurentCompte, setCurentMonth, TransactionMonthInterface } from '../../../../redux/comptesSlice';
import { addCategory, CategoryInterface } from '../../../../redux/categorySlice';
import { createNewTransaction, defineFormAddBudget, defineIDTransaction, FormAddBudget, getAllCategory, ResetForm, saveTransaction, UpdateTransaction, ValidateForm } from './logic';
import globalStyle from '../../../../assets/styleSheet/globalStyle';

interface ModalAddBudgetProps {
    isViewModalAddBudget: boolean,
    setIsViewModalAddBudget: (value: boolean, transaction: TransactionMonthInterface | null) => void,
    transaction?: TransactionMonthInterface | null
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



    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isViewModalAddBudget}
            onRequestClose={() => {
                closeModal();

            }}
            style={styleSheet.modal}
        >

            <View style={styleSheet.modalContainer}>


                <View style={styleSheet.modalBody}>
                    <Text style={styleSheet.titleModal}>Ajoutez une transaction</Text>
                    <View style={[globalStyle.flexRow, { width: '100%', justifyContent: 'space-between' }, globalStyle.marginVertical]} >
                        <TouchableOpacity
                            onPress={() => {
                                setCurentEtape('Etape1');

                            }}
                        >
                            <Text style={[styleSheet.modalInputLabel, {
                                color: curentEtape === 'Etape1' ? '#817FE5' : 'rgba(129, 127, 229, 0.26)'
                            }]}>Etape 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCurentEtape('Etape2');
                            }}
                        >
                            <Text style={[styleSheet.modalInputLabel, {
                                color: curentEtape === 'Etape2' ? '#817FE5' : 'rgba(129, 127, 229, 0.26)'
                            }]}>Etape 2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCurentEtape('Etape3');
                            }}
                        >
                            <Text style={[styleSheet.modalInputLabel, {
                                color: curentEtape === 'Etape3' ? '#817FE5' : 'rgba(129, 127, 229, 0.26)'
                            }]}>Etape 3</Text>
                        </TouchableOpacity>


                    </View>
                    {
                        curentEtape === 'Etape1' &&
                        <View>
                            <View>
                                <Text style={styleSheet.modalInputLabel}>nom :</Text>
                                <Input placeholder="nom de votre budget"
                                    errorMessage={formAddBudget.errorName}
                                    value={formAddBudget.name}
                                    onChangeText={(value) => {
                                        setFormAddBudget({ ...formAddBudget, name: value });
                                    }}
                                />
                            </View>
                            <View>
                                <Text style={styleSheet.modalInputLabel}>montant :</Text>
                                <Input placeholder="montant de votre budget"
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
                        <View>
                            <View>
                                <Text style={styleSheet.modalInputLabel}>Type de transaction</Text>
                                <View style={[globalStyle.flexRow]}>
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, typeTransaction: 'Spent' });
                                        }}
                                        title='Dépense'
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={formAddBudget.typeTransaction === 'Spent' ? true : false}
                                    />
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, typeTransaction: 'Budget' });
                                        }}
                                        title='Budget'
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={formAddBudget.typeTransaction === 'Budget' ? true : false}
                                    />
                                </View>


                            </View>
                            <View>
                                <Text style={styleSheet.modalInputLabel}>Type d'operation</Text>
                                <View style={[globalStyle.flexRow]}>
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, typeOperation: 'income' });
                                        }}
                                        title='Dépôt'
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={formAddBudget.typeOperation === 'income' ? true : false}
                                    />
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, typeOperation: 'expense' });
                                        }}
                                        title='Retrait'
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={formAddBudget.typeOperation === 'expense' ? true : false}
                                    />
                                </View>


                            </View>
                        </View>}
                    {
                        curentEtape === 'Etape3' &&
                        <View>
                            <View>
                                <Text style={styleSheet.modalInputLabel}>cette operation est elle unique?</Text>
                                <View style={[globalStyle.flexRow]}>
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, isUnique: true });
                                        }}
                                        title='oui'
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={formAddBudget.isUnique ? true : false}
                                    />
                                    <CheckBox
                                        onPress={() => {
                                            setFormAddBudget({ ...formAddBudget, isUnique: false });
                                        }}
                                        title='nom'
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={!formAddBudget.isUnique ? true : false}
                                    />
                                </View>
                            </View>

                            {
                                !formAddBudget.isUnique &&
                                <View>
                                    <Text style={styleSheet.modalInputLabel}>l’opération ce répète tous les </Text>
                                    <View style={[globalStyle.flexRow]}>

                                        <CheckBox
                                            onPress={() => {
                                                setFormAddBudget({ ...formAddBudget, period: 'day' });
                                            }}
                                            title='jours'
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checked={formAddBudget.period == "day" ? true : false}
                                        />
                                        <CheckBox
                                            onPress={() => {
                                                setFormAddBudget({ ...formAddBudget, period: "week" });
                                            }}
                                            title='weekends'
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checked={formAddBudget.period == "week" ? true : false}
                                        />
                                    </View>
                                    <View style={[globalStyle.flexRow]}>

                                        <CheckBox
                                            onPress={() => {
                                                setFormAddBudget({ ...formAddBudget, period: 'month' });
                                            }}
                                            title='mois'
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checked={formAddBudget.period == "month" ? true : false}
                                        />
                                        <CheckBox
                                            onPress={() => {
                                                setFormAddBudget({ ...formAddBudget, period: 'year' });
                                            }}
                                            title='ânées'
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checked={formAddBudget.period == "year" ? true : false}
                                        />
                                    </View>
                                </View>
                            }


                            <View>
                                <Text style={styleSheet.modalInputLabel}>Category de la transaction</Text>
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
                            <Button
                                color={"#817FE5"}
                                radius={5}
                                disabledStyle={{ backgroundColor: "rgba(129, 127, 229, 0.26)" }}

                                title={transaction ? "Enregistrée" : 'Ajouter'}
                                onPress={() => {

                                    if (!transaction) {
                                        /* ADD TRANSACTION  */
                                        if (ValidateForm(formAddBudget, setFormAddBudget)) {

                                            const newID = defineIDTransaction(currentMonthRedux, formAddBudget.typeOperation);

                                            const newTransaction: TransactionMonthInterface = createNewTransaction(newID, formAddBudget)

                                            const newM = { ...currentMonthRedux }

                                            if (newTransaction.typeOperation === 'income') {

                                                newM.transactions = {
                                                    ...currentMonthRedux.transactions,
                                                    income: [...currentMonthRedux.transactions.income, newTransaction]
                                                }

                                            } else if (newTransaction.typeOperation === 'expense') {

                                                newM.transactions = {
                                                    ...currentMonthRedux.transactions,
                                                    expense: [...currentMonthRedux.transactions.expense, newTransaction]
                                                }

                                            } else {

                                                throw new Error('typeOperation not found')
                                            }



                                            saveTransaction({ ...currentCompteRedux }, { ...newM }, newTransaction).then((res) => {

                                                dispatch(setCurentCompte(res));
                                                dispatch(setCurentMonth(newM))
                                                closeModal()
                                            })
                                        } else {
                                            setCurentEtape('Etape1')
                                        }

                                    } else {
                                        /* EDIT TRANSACTION  */

                                        if (ValidateForm(formAddBudget, setFormAddBudget)) {

                                            UpdateTransaction({
                                                allTransaction: transaction,
                                                curentCompte: currentCompteRedux,
                                                curentMonth: currentMonthRedux,
                                                newTransaction: formAddBudget
                                            }).then((res: {
                                                compte: CompteInterface,
                                                curentMonth: MonthInterface
                                            }) => {

                                                dispatch(setCurentCompte(res.compte));
                                                dispatch(setCurentMonth(res.curentMonth))
                                                closeModal()

                                            }).catch((err) => { console.log(err) })

                                        } else {
                                            setCurentEtape('Etape1')
                                        }
                                    }
                                }
                                }
                                icon={
                                    <Icon
                                        name="check"
                                        size={15}
                                        color="white"
                                        type='font-awesome'

                                    />
                                }

                            />
                        </View>}

                    {
                        curentEtape !== 'Etape3' &&
                        <Button
                            title="Suivant"
                            onPress={() => {
                                switch (curentEtape) {
                                    case 'Etape1':
                                        setCurentEtape('Etape2')
                                        break;
                                    case 'Etape2':
                                        setCurentEtape('Etape3')
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

                                />
                            }
                            color="#841584"


                        />
                    }

                </View>
            </View>


        </Modal >
    );





    function closeModal() {

        setFormAddBudget(ResetForm())
        setCurentEtape('Etape1')
        setIsViewModalAddBudget(false, null)
    }






}






