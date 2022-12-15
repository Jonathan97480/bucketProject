import React from "react";
import { View } from "react-native";

export const SectionCustom = ({ children }: { children?: JSX.Element | JSX.Element[]; }) => {

    return (
        <View >
            {children}
        </View>
    )
}
