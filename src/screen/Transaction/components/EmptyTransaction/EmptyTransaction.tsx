import React from "react";
import { View, Text } from "react-native";
import { Image, Button } from "@rneui/base";

import styleSheet from "./styleSheet";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { getMonthByNumber } from "../../../../utils/DateManipulation";
import { IconBudgetAdd_image } from "../../../../utils/IconCustom";
import { getTrad } from "../../../../lang/internationalization";
interface EmptyBudgetProps {
    setIsViewModalAddBudget: (value: boolean) => void

}

export const EmptyTransaction = ({ setIsViewModalAddBudget }: EmptyBudgetProps) => {

    return (
        <View style={{ backgroundColor: 'red' }}>

            <View style={styleSheet.container}>
                <Image
                    source={IconBudgetAdd_image}
                    style={styleSheet.image}
                />
                <Text style={[globalStyle.titleStyle, globalStyle.textAlignCenter, { lineHeight: 30, marginBottom: 20 }]}>{getTrad("YouDoNotTransactionMonth")} {getMonthByNumber(new Date().getMonth() + 1)}</Text>
                <Button
                    radius={5}
                    title={getTrad("AddTransaction")}
                    titleStyle={globalStyle.btnTitleStyle}
                    containerStyle={globalStyle.btnContainerStyle}
                    onPress={() => {
                        setIsViewModalAddBudget(true);
                    }} />

            </View>
        </View>

    )

}

