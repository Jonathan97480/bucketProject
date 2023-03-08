import React from "react";
import { View, Text, TouchableOpacity, Image, Alert, SafeAreaView, ScrollView } from "react-native";
import styleSheet from "./styleSheet";

interface TitleProps {

    title: string

}

export default function Title({ title }: TitleProps) {

    return (
        <View style={styleSheet.container}  >
            <Text style={styleSheet.title}  >{title}</Text>
        </View>
    )

}