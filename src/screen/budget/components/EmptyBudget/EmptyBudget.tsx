import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image, Button } from "@rneui/base";
import { IconBudgetAdd } from "../../../../utils/IconCustom";
import styleSheet from "./styleSheet";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { getMonthByNumber } from "../../../../utils/DateManipulation";

interface EmptyBudgetProps {
    setIsViewModalAddBudget: (value: boolean) => void
}

export const EmptyBudget = ({ setIsViewModalAddBudget }: EmptyBudgetProps) => {

    return (
        <View style={styleSheet.container}>

            <Image
                source={IconBudgetAdd}
                style={styleSheet.image}
            />
            <Text style={[styleSheet.title, globalStyle.colorTextPrimary, globalStyle.textAlignCenter]}>Vous n'avez pas encore de Transaction Pour le mois de {getMonthByNumber(new Date().getMonth() + 1)}</Text>
            <Button

                color='#817FE5'
                radius={5}
                title="Ajouter une Transaction" onPress={() => {
                    setIsViewModalAddBudget(true);
                }} />

        </View>
    )

}
