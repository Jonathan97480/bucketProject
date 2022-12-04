import React, { useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { addExpend, listeExpendInterface, PoleExpend } from '../redux/expendSlice';
import { SafeAreaView } from "react-native-safe-area-context";

import { SectionCustom } from "../components/SectionCustom";
import { SectionTitle } from "../components/SectionTitle";
import { ItemBudget } from "../components/ItemBudget";
import { IconBudgetEmpty } from "../utils/IconCustom";
import { Image } from "@rneui/base";
import { getAllExpend } from "../utils/GetBudgetAndExpend";



export const AddExpend = () => {

    const dispatch = useDispatch();
    const budget: PoleExpend[] = useSelector((state: any) => state.expend.expends);


    useEffect(() => {

        if (budget.length <= 0) {

            getAllExpend().then((data) => {
                if (data.length > 0) {
                    dispatch(addExpend(data));
                }
            });


        }
    }, [budget]);


    return (
        <SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollView}>

                <View style={styles.container} >
                    {budget.length !== 0 ? budget.map((pole, index) => {
                        return (
                            <SectionCustom key={`${pole.id}-${index}`}>
                                <SectionTitle title={pole.nom} id_budget={pole.id} remaining_budget={pole.montant} budget_start={pole.montantStart} indexBudget={index} />
                                <GenerateListeComponentsItemExpend listeExpend={pole.listeExpend} indexBudget={index} />
                            </SectionCustom>
                        )
                    })
                        : <View style={styles.scrollView}>
                            <Image source={IconBudgetEmpty} style={{ width: 200, height: 200 }} />
                            <Text style={styles.title}>
                                Vous devais définir un budget avant de rajouter des transaction
                            </Text>
                        </View>}
                </View>
            </ScrollView>

        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    scrollView: {

        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%"

    },
    container: {
        justifyContent: "center",
        alignItems: "center"
    }, title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
        lineHeight: 30,

    }

});

interface GenerateListeComponentsItemExpendProps {
    listeExpend: listeExpendInterface[],

    indexBudget: number
}


export function GenerateListeComponentsItemExpend({ listeExpend, indexBudget }: GenerateListeComponentsItemExpendProps) {

    return (
        <>
            {
                listeExpend.length > 0 ?
                    listeExpend.map((item, index) => {
                        return (
                            <ItemBudget key={index} title={item.name} montant={item.montant} id_expend={item.id} name_category={item.category} indexBudget={indexBudget} type={item.type} />
                        )
                    })
                    : <Text style={{ textAlign: "center" }}>Vous n'avez pas encore d'éléments dans ce budget</Text>

            }

        </>
    )

}




