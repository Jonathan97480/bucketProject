import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image, Button } from "@rneui/base";
import { IconBudgetAdd } from "../../../../utils/IconCustom";
import styleSheet from "./styleSheet";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { getMonthByNumber } from "../../../../utils/DateManipulation";
import { IconBudgetAdd_image } from "../../../../utils/IconCustom";

interface EmptyBudgetProps {
    setIsViewModalAddBudget: (value: boolean) => void
    trad: any
}

export const EmptyTransaction = ({ setIsViewModalAddBudget, trad }: EmptyBudgetProps) => {

    return (
        <View style={styleSheet.container}>

            <Image
                source={IconBudgetAdd_image}
                style={styleSheet.image}
            />
            <Text style={[styleSheet.title, globalStyle.colorTextPrimary, globalStyle.textAlignCenter]}>{trad.YouDoNotTransactionMonth} {getMonthByNumber(new Date().getMonth() + 1)}</Text>
            <Button

                color='#817FE5'
                radius={5}
                title={trad.AddTransaction}
                onPress={() => {
                    setIsViewModalAddBudget(true);
                }} />

        </View>
    )

}

