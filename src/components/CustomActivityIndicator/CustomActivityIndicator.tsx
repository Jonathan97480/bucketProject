import React from "react";
import { View, ActivityIndicator } from "react-native";
import styleSheet from "./styleSheet";


export default function CustomActivityIndicator() {


    return (
        <View style={styleSheet.container} >
            <ActivityIndicator size={100} color="#817FE5" />
        </View>
    )




}