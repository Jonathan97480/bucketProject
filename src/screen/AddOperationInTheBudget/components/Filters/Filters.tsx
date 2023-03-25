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

    return <View style={styleSheet.container}>
        <Text style={[
            globalStyle.colorTextPrimary,
            globalStyle.textAlignLeft,
            globalStyle.textSizeMedium,
        ]}>Filtres </Text>
        <View style={globalStyle.containerCheckBox}>

            <CheckBox

                title="Sortie"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={globalStyle.checkBox}
                textStyle={checked === "Expense" ? globalStyle.checkBoxText : null}
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
                textStyle={checked === "Income" ? globalStyle.checkBoxText : null}
                containerStyle={globalStyle.checkBox}
                checked={checked === "Income" ? true : false}
                onPress={() => {
                    setChecked("Income");
                    onChanges("Income");
                }}

            />
        </View>
    </View>


}