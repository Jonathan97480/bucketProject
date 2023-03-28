
import { FAB } from "@rneui/base";
import React, { useEffect, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import styleSheet from "./styleSheet";
import { EmptyTransaction } from "./components/EmptyTransaction/EmptyTransaction";
import { ModalAddBudget } from "./components/ModalAddTransaction/ModalAddTransaction";
import TransactionSwipeable from "./components/TransactionSwipeable/TransactionSwipeable";
import { MonthInterface, TransactionMonthInterface } from "../../redux/comptesSlice";
import globalStyle from "../../assets/styleSheet/globalStyle";
import { CustomSafeAreaView } from "../../components";
import { getLocales } from 'expo-localization';
import { trad } from "../../lang/internationalization";




export const Transaction = () => {
    const local: "FR" | "EN" = getLocales()[0].languageCode === "fr" ? "FR" : "EN";
    const navigation = useNavigation();

    const currentMonthRedux: MonthInterface = useSelector((state: any) => state.compte.currentMonth);

    const [curentTransaction, setCurentTransaction] = React.useState<TransactionMonthInterface | null>(null);


    const [isViewModalAddBudget, setIsViewModalAddBudget] = React.useState(false);
    const [curentMonth, setCurentMonth] = React.useState<MonthInterface | null>(null);


    useEffect(() => {

        setCurentMonth(currentMonthRedux);

    }, [currentMonthRedux]);


    const editTransactionCallBack = useCallback((val: boolean, Transaction: TransactionMonthInterface | null) => {
        setIsViewModalAddBudget(val);
        setCurentTransaction(Transaction);


    }, []);

    if (curentMonth === null) {
        return (
            <CustomSafeAreaView >
                <View style={styleSheet.container}>
                    <EmptyTransaction

                        setIsViewModalAddBudget={setIsViewModalAddBudget}
                        trad={trad[local]}

                    />
                </View>
            </CustomSafeAreaView>
        )
    }

    return (
        <CustomSafeAreaView >

            <View style={styleSheet.container}>

                {

                    curentMonth.transactions.expense.length > 0 || curentMonth.transactions.income.length > 0 ?
                        <ScrollView contentContainerStyle={styleSheet.scrollView}>
                            <View
                                style={styleSheet.scrollViewContainer}
                            >
                                <Text style={[styleSheet.title, globalStyle.colorTextPrimary]} >
                                    {trad[local].TransactionList}
                                </Text>
                                <Text style={[globalStyle.colorTextPrimary, globalStyle.textSizeXLarge, globalStyle.marginVertical]} >{trad[local].DepositToAccount}</Text>
                                {
                                    curentMonth.transactions.income.length > 0 ?
                                        curentMonth.transactions.income.map((item, indexBudget) => {
                                            return (


                                                <View style={{
                                                    marginVertical: 5,
                                                    height: "auto",

                                                }} key={item.id}
                                                >

                                                    <TransactionSwipeable
                                                        transaction={item}
                                                        indexBudget={indexBudget}
                                                        setModalEdit={editTransactionCallBack}
                                                        navigation={navigation}
                                                        trad={trad[local]}
                                                    />
                                                </View>

                                            )

                                        })
                                        : null

                                }
                                <Text style={[globalStyle.colorTextPrimary, globalStyle.textSizeXLarge, globalStyle.marginVertical]}>{trad[local].WithdrawalAccount}</Text>
                                {
                                    curentMonth.transactions.expense.length > 0 ?
                                        curentMonth.transactions.expense.map((item, indexBudget) => {
                                            return (


                                                <View style={{
                                                    marginVertical: 5,
                                                    height: "auto",

                                                }} key={item.id}
                                                >
                                                    <TransactionSwipeable
                                                        transaction={item}
                                                        indexBudget={indexBudget}
                                                        setModalEdit={editTransactionCallBack}
                                                        navigation={navigation}
                                                        trad={trad[local]}
                                                    />
                                                </View>

                                            )

                                        }) : null
                                }



                            </View>

                        </ScrollView>

                        : <EmptyTransaction setIsViewModalAddBudget={setIsViewModalAddBudget}
                            trad={trad[local]}
                        />

                }


                <ModalAddBudget
                    isViewModalAddBudget={isViewModalAddBudget}
                    setIsViewModalAddBudget={editTransactionCallBack}
                    transaction={curentTransaction}

                />
                {curentMonth.transactions.expense.length > 0 || curentMonth.transactions.income.length > 0 ?
                    <FAB
                        visible={true}
                        icon={{ name: 'add', color: 'white' }}
                        placement="right"
                        color="#4F94BB"
                        onPress={() => setIsViewModalAddBudget(true)}
                    /> : null}
            </View>


        </CustomSafeAreaView>
    );

}


















