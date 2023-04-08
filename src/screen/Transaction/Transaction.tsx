
import { FAB } from "@rneui/base";
import React, { useEffect, useCallback } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import styleSheet from "./styleSheet";
import { EmptyTransaction } from "./components/EmptyTransaction/EmptyTransaction";
import { ModalAddBudget } from "./components/ModalAddTransaction/ModalAddTransaction";
import TransactionSwipeable from "./components/TransactionSwipeable/TransactionSwipeable";
import { MonthInterface, TransactionMonthInterface } from "../../redux/comptesSlice";
import globalStyle from "../../assets/styleSheet/globalStyle";
import { BannerAds, CustomSafeAreaView, Title } from "../../components";
import { getTrad } from "../../lang/internationalization";


export const Transaction = () => {

    const navigation = useNavigation();
    const { width, height } = Dimensions.get('window');

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

                <BannerAds
                    key="ca-app-pub-2398424925470703/9529057345"
                />
            </CustomSafeAreaView>
        )
    }

    return (
        <CustomSafeAreaView >
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 0
                }}
            >
                <BannerAds />

            </View>


            {

                curentMonth.transactions.expense.length > 0 || curentMonth.transactions.income.length > 0 ?
                    <ScrollView contentContainerStyle={styleSheet.scrollView}>
                        <View
                            style={{
                                justifyContent: "flex-start",
                                width: "100%",
                                flex: 1,
                                alignItems: "center",

                            }}
                        >
                            <Title title={getTrad("TransactionList")} />

                            <Text style={[globalStyle.colorTextPrimary, globalStyle.textSizeLarge, globalStyle.marginVertical]} >{getTrad("DepositToAccount")}</Text>
                            {
                                curentMonth.transactions.income.length > 0 ?
                                    curentMonth.transactions.income.slice(0).reverse().map((item, indexBudget) => {
                                        return (


                                            <View style={{
                                                marginVertical: 5,
                                                height: "auto",
                                                alignItems: "center",
                                                width: width > 500 ? 500 : width * 0.8,
                                                maxWidth: width > 500 ? 500 : "100%",


                                            }} key={item.id}
                                            >

                                                <TransactionSwipeable
                                                    transaction={item}
                                                    indexBudget={indexBudget}
                                                    setModalEdit={editTransactionCallBack}
                                                    navigation={navigation}

                                                />
                                            </View>

                                        )

                                    })
                                    : null

                            }
                            <Text style={[globalStyle.colorTextPrimary, globalStyle.textSizeLarge, globalStyle.marginVertical]}>{getTrad("WithdrawalAccount")}</Text>
                            {
                                curentMonth.transactions.expense.length > 0 ?
                                    curentMonth.transactions.expense.slice(0).reverse().map((item, indexBudget) => {
                                        return (


                                            <View style={{
                                                marginVertical: 5,
                                                height: "auto",
                                                width: width > 500 ? 500 : width * 0.8,
                                                maxWidth: width > 500 ? 500 : "100%",


                                            }} key={item.id}
                                            >
                                                <TransactionSwipeable
                                                    transaction={item}
                                                    indexBudget={indexBudget}
                                                    setModalEdit={editTransactionCallBack}
                                                    navigation={navigation}

                                                />
                                            </View>

                                        )

                                    }) : null
                            }



                        </View>

                    </ScrollView>

                    : <EmptyTransaction setIsViewModalAddBudget={setIsViewModalAddBudget}

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



        </CustomSafeAreaView>
    );

}


















