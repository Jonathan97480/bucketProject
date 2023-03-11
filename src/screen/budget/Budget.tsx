
import { Button, Icon } from "@rneui/base";
import React, { useEffect, useCallback } from "react";
import { View, Text, ScrollView, StatusBar, SafeAreaView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import styleSheet from "./styleSheet";
import { EmptyBudget } from "./components/EmptyBudget/EmptyBudget";
import { InfoModal } from "./components/InfoBudget/InfoBudget";
import { ModalAddBudget } from "./components/ModalAddBudget/ModalAddBudget";
import { addExpend, PoleExpend } from "../../redux/expendSlice";
import { colorList } from "../../utils/ColorCollection";
import { getAllExpend } from "../../utils/GetBudgetAndExpend";
import BudgetSwipeable from "./components/BudgetSwipeable/BudgetSwipeable";
import { MonthInterface } from "../../redux/comptesSlice";
import globalStyle from "../../assets/styleSheet/globalStyle";



export interface curentBudgetInterface {
    budget: PoleExpend;
    indexBudget: number;
}


export const Budget = () => {

    const navigation = useNavigation();

    const currentMonthRedux: MonthInterface = useSelector((state: any) => state.compte.currentMonth);

    const [curentBudget, setCurentBudget] = React.useState<curentBudgetInterface | undefined>(undefined);

    const dispatch = useDispatch();

    const [isViewModalAddBudget, setIsViewModalAddBudget] = React.useState(false);
    const [isViewModalInfo, setIsViewModalInfo] = React.useState(false);



    useEffect(() => {


    }, [currentMonthRedux]);


    const editTransactionCallBack = useCallback(() => {
        setIsViewModalAddBudget(true);
    }, []);


    return (
        <SafeAreaView
            style={styleSheet.safeAreaView}
        >
            <StatusBar barStyle="default" />
            <View style={styleSheet.container}>

                {

                    currentMonthRedux !== null && currentMonthRedux.transactions.length > 0 ?
                        <ScrollView contentContainerStyle={styleSheet.scrollView}>
                            <View
                                style={styleSheet.scrollViewContainer}
                            >
                                <Text style={[styleSheet.title, globalStyle.colorTextPrimary]} >
                                    Liste Des transactions
                                </Text>
                                {
                                    currentMonthRedux.transactions.map((item, indexBudget) => {
                                        return (


                                            <View style={{
                                                marginVertical: 5,
                                                height: "auto",

                                            }} key={item.id}
                                            >

                                                <BudgetSwipeable
                                                    transaction={item}
                                                    indexBudget={indexBudget}
                                                    setCurentBudget={setCurentBudget}
                                                    setIsViewModalInfo={setIsViewModalInfo}
                                                    navigation={navigation}
                                                />
                                            </View>

                                        )

                                    })
                                }
                                <Button
                                    buttonStyle={styleSheet.buttonAddBudget}
                                    title="Ajouter"
                                    icon={
                                        <Icon
                                            name="plus"
                                            type='font-awesome'
                                            color={colorList.primary}
                                        />
                                    }
                                    onPress={() => setIsViewModalAddBudget(true)}
                                />

                            </View>

                        </ScrollView>
                        : <EmptyBudget setIsViewModalAddBudget={setIsViewModalAddBudget} />

                }


                <ModalAddBudget
                    isViewModalAddBudget={isViewModalAddBudget}
                    setIsViewModalAddBudget={setIsViewModalAddBudget}
                    transaction={undefined}
                />
            </View>

            {
                curentBudget !== undefined ?

                    <InfoModal
                        IsViewModalInfo={isViewModalInfo}
                        setIsViewModalInfo={setIsViewModalInfo}
                        budget={curentBudget.budget}
                        indexBudget={curentBudget.indexBudget}
                        editTransactionCallBack={editTransactionCallBack}
                    /> : null
            }
        </SafeAreaView>
    );

}


















