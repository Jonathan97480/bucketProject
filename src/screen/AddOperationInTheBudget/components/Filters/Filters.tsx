import React, { useState } from "react";
import { View, Text } from "react-native";
import { CheckBox } from "@rneui/base";
import styleSheet from "./styleSheet";
import globalStyle from "../../../../assets/styleSheet/globalStyle";


interface FiltersProps {
    onChanges: (value: "Income" | "Expense") => void;
}

export const Filters = ({ onChanges }: FiltersProps) => {

    const [checked, setChecked] = useState<"Income" | "Expense">("Expense");

    return < >
        <Text style={[
            globalStyle.labelStyle,
            { margin: 0, padding: 0 }
        ]}>Filtres </Text>
        <View style={
            {
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
                margin: 0,
                padding: 0,
                height: 55,

            }
        }>

            <CheckBox

                title="Sortie"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={[globalStyle.containerCheckBoxStyle, { width: "40%" }]}
                textStyle={globalStyle.titleStyleCheckBox}
                checkedColor={globalStyle.checkedColorCheckBox.color}
                checked={checked === "Expense" ? true : false}
                onPress={() => {
                    setChecked("Expense");
                    onChanges("Expense");
                }}
            />
            <CheckBox

                title="Entrée"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={[globalStyle.containerCheckBoxStyle, { width: "40%" }]}
                textStyle={globalStyle.titleStyleCheckBox}
                checkedColor={globalStyle.checkedColorCheckBox.color}
                checked={checked === "Income" ? true : false}
                onPress={() => {
                    setChecked("Income");
                    onChanges("Income");
                }}

            />
        </View>
    </>


}