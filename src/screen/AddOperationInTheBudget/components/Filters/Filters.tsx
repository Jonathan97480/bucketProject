import React, { useState } from "react";
import { View, Text } from "react-native";
import { Icon, Input, CheckBox } from "@rneui/base";
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
        <View style={styleSheet.containerCheckBox}>

            <CheckBox

                title="Sortie"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={styleSheet.checkBox}
                textStyle={checked === "Expense" ? styleSheet.checkBoxText : null}
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
                textStyle={checked === "Income" ? styleSheet.checkBoxText : null}
                containerStyle={styleSheet.checkBox}
                checked={checked === "Income" ? true : false}
                onPress={() => {
                    setChecked("Income");
                    onChanges("Income");
                }}

            />
        </View>
    </View>


}