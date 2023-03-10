import React from "react";
import { View, Text, TouchableOpacity, Image, Alert, SafeAreaView, ScrollView } from "react-native";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { CompteInterface } from "../../../../redux/comptesSlice";
import { getMonthByNumber } from "../../../../utils/DateManipulation";
import styleSheet from "./styleSheet";


interface InfoCompteProps {
    compte: CompteInterface;

}

export default function InfoCompte({ compte }: InfoCompteProps) {

    const curentYear = new Date(compte.date).getFullYear()

    return (
        <View style={styleSheet.blockCurentMonth} >
            <View style={{ marginBottom: 32 }} >
                <Text style={[globalStyle.textAlignCenter, globalStyle.colorTextPrimary]} >Aperçu</Text>
                <Text style={[globalStyle.textAlignCenter, globalStyle.colorTextPrimary]} >{compte.name}</Text>
                <Text style={[styleSheet.blockCurentMonthText, globalStyle.colorTextPrimary]}> {curentYear}</Text>
            </View>


            <View style={styleSheet.infoBlock}>

                <View style={styleSheet.infoBlockText} >
                    <Text style={globalStyle.colorTextPrimary}>{compte.deposit}</Text>
                    <Text style={[globalStyle.textSizeSmall, globalStyle.colorTextPrimary]} >Revenues</Text>

                </View>

                <View style={styleSheet.separator} ></View>
                <View style={styleSheet.infoBlockText} >
                    <Text style={globalStyle.colorTextPrimary}>{compte.withdrawal}</Text>
                    <Text style={[globalStyle.textSizeSmall, globalStyle.colorTextPrimary]} >Dépense</Text>

                </View>
                <View style={styleSheet.separator} ></View>
                <View style={styleSheet.infoBlockText} >
                    <Text style={globalStyle.colorTextPrimary}>{compte.pay}</Text>
                    <Text style={[globalStyle.textSizeSmall, globalStyle.colorTextPrimary]} >Solde</Text>

                </View>
            </View>

        </View>
    )

}