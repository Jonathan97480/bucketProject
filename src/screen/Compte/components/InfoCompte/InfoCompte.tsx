import React from "react";
import { View, Text } from "react-native";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { CompteInterface } from "../../../../redux/comptesSlice";
import styleSheet from "./styleSheet";


interface InfoCompteProps {
    compte: CompteInterface;

}

export default function InfoCompte({ compte }: InfoCompteProps) {


    return (
        <View style={styleSheet.blockCurentMonth} >
            <View style={{ marginBottom: 32 }} >
                <Text style={[globalStyle.textAlignCenter, globalStyle.colorTextPrimary]} >Aperçu</Text>
                <Text style={[globalStyle.textAlignCenter, globalStyle.colorTextPrimary]} >{compte.name}</Text>
                <Text style={[styleSheet.blockCurentMonthText, globalStyle.colorTextPrimary]}> {new Date().getFullYear()}</Text>
            </View>


            <View style={styleSheet.infoBlock}>

                <View style={styleSheet.infoBlockText} >
                    <Text style={globalStyle.colorTextPrimary}>{compte.deposit.toFixed(2)} €</Text>
                    <Text style={[globalStyle.textSizeSmall, globalStyle.colorTextPrimary]} >Revenues</Text>

                </View>

                <View style={styleSheet.separator} ></View>
                <View style={styleSheet.infoBlockText} >
                    <Text style={globalStyle.colorTextPrimary}>{compte.withdrawal.toFixed(2)} €</Text>
                    <Text style={[globalStyle.textSizeSmall, globalStyle.colorTextPrimary]} >Dépense</Text>

                </View>
                <View style={styleSheet.separator} ></View>
                <View style={styleSheet.infoBlockText} >
                    <Text style={globalStyle.colorTextPrimary}>{compte.pay.toFixed(2)} €</Text>
                    <Text style={[globalStyle.textSizeSmall, globalStyle.colorTextPrimary]} >Solde</Text>

                </View>
            </View>

        </View>
    )

}