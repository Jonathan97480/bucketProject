import { Icon } from "@rneui/base";
import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import globalStyle from "../../assets/styleSheet/globalStyle";
import styleSheet from "./styleSheet";
import ArchiveItem from "./components/ArchiveItem/ArchiveItem";
import InfoCompte from "./components/InfoCompte/InfoCompte";
import { useSelector, useDispatch } from "react-redux";
import { CompteInterface, setCUrentCompte } from "../../redux/comptesSlice";
import { getMonthByNumber } from "../../utils/DateManipulation";
import { FixeIsYearAndMonthExist } from "./logic";
import DatabaseManager from "../../utils/DataBase";

export default function Compte() {

    const dispatch = useDispatch();

    const currentCompte: CompteInterface = useSelector((state: any) => state.compte.currentCompte);


    useEffect(() => {

        const newCompte = FixeIsYearAndMonthExist(currentCompte);

        if (newCompte !== null) {

            DatabaseManager.UpdateCompte(
                newCompte.id,
                newCompte.name,
                newCompte.pay,
                newCompte.withdrawal,
                newCompte.deposit,
                newCompte.transactions

            ).then((compte) => {
                dispatch(setCUrentCompte(compte))
            }).catch((error) => { console.log(error) })

        }



    }, [currentCompte])



    return (

        <View style={[globalStyle.backgroundPrimaryColor, { maxHeight: "100%", height: "100%" }]}>

            <InfoCompte
                compte={currentCompte}
            />

            <View style={styleSheet.container}>


                <ScrollView style={[styleSheet.scrollview,]}>

                    <View style={[globalStyle.containerCenter, { alignItems: "center" }]}>
                        {

                            currentCompte.transactions.map((YearTransaction, index) => {
                                return (
                                    <View key={`list-index-${index}`}>
                                        <Text style={[globalStyle.textSizeLarge, globalStyle.colorTextPrimary, globalStyle.textAlignCenter, globalStyle.marginVertical]} >{YearTransaction.year} </Text>
                                        <ArchiveItem
                                            months={YearTransaction.month}
                                            year={YearTransaction.year}
                                        />
                                    </View>








                                )
                            })

                        }
                    </View>
                </ScrollView>

            </View>

        </View>

    )

}




