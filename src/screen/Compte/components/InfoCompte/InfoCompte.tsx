import React from "react";
import { View, Text, Dimensions } from "react-native";

import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { CompteInterface } from "../../../../redux/comptesSlice";
import styleSheet from "./styleSheet";
import { getTrad } from "../../../../lang/internationalization";


interface InfoCompteProps {
    compte: CompteInterface;
}


export default function InfoCompte({ compte, }: InfoCompteProps) {

    const { width } = Dimensions.get('window');

    return (
        <View style={styleSheet.blockCurentMonth} >
            <View style={{ marginBottom: 32 }} >
                <Text style={[globalStyle.textAlignCenter, globalStyle.colorTextPrimary, { fontSize: width * 0.04 }]} >{getTrad("Insights")}</Text>
                <Text style={[globalStyle.textAlignCenter, globalStyle.colorTextPrimary, { fontSize: width * 0.05 }]} >{compte.name}</Text>
                <Text style={[styleSheet.blockCurentMonthText, globalStyle.colorTextPrimary, { fontSize: width * 0.04 }]}> {new Date().getFullYear()}</Text>
            </View>


            <View style={styleSheet.infoBlock}>
                <ItemInfoCompte
                    title={getTrad("income")}
                    value={compte.deposit.toFixed(2)}
                />


                <ItemInfoCompte
                    title={getTrad("expense")}
                    value={compte.withdrawal.toFixed(2)}
                    isSeparator={true}
                />

                <ItemInfoCompte
                    title={getTrad("pay")}
                    value={compte.pay.toFixed(2)}
                    isSeparator={true}
                />
            </View>

        </View>
    )

}


interface ItemInfoCompteProps {
    title: string;
    value: number | string;
    isSeparator?: boolean;
}

const ItemInfoCompte = (props: ItemInfoCompteProps) => {

    const { width } = Dimensions.get('window');
    return (
        <>
            {props.isSeparator && <View style={styleSheet.separator} ></View>}
            <View style={styleSheet.infoBlockText} >
                <Text style={[globalStyle.colorTextPrimary, { fontSize: width * 0.035 }]}>{props.value} €</Text>
                <Text style={[{ fontSize: width * 0.03 }, globalStyle.colorTextPrimary]} >{props.title}</Text>

            </View>
        </>
    )
};