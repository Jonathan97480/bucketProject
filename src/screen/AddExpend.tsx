import React, { useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { addExpend, listeExpendInterface, PoleExpend } from '../redux/expendSlice';
import DatabaseManager from "../utils/DataBase";
import { SafeAreaView } from "react-native-safe-area-context";

import { budgetInterface } from "../redux/budgetSlice";
import { SectionCustom } from "../components/SectionCustom";
import { SectionTitle } from "../components/SectionTitle";
import { ItemBudget } from "../components/ItemBudget";
import { IconBudgetEmpty } from "../utils/IconCustom";
import { Image } from "@rneui/base";






export const AddExpend = () => {

    const dispatch = useDispatch();
    const budget: PoleExpend[] = useSelector((state: any) => state.expend.expends);
    const budgetSlice: budgetInterface[] = useSelector((state: any) => state.budget.budgets);

    function ItemAddExpendSlice(Expend: listeExpendInterface, indexBudget: number) {
        let newBudgets = [...budget];
        let budgetCurent = { ...newBudgets[indexBudget] };
        budgetCurent.listeExpend = [...budgetCurent.listeExpend, Expend];

        newBudgets[indexBudget] = budgetCurent;


        const newBudgetMontant = Expend.type === "add" ? budgetCurent.montant + Expend.montant : budgetCurent.montant - Expend.montant;

        DatabaseManager.updateBudgetMontant(budgetCurent.id, newBudgetMontant).then(() => {

            newBudgets[indexBudget].montant = newBudgetMontant;

            dispatch(addExpend(newBudgets));
        });



    };

    function ItemDeleteExpendSlice(indexBudget: number, idExpend: number) {

        let newBudgets = [...budget];
        let budgetCurent = { ...newBudgets[indexBudget] };
        budgetCurent.listeExpend = [...budgetCurent.listeExpend];
        const curentExpends = budgetCurent.listeExpend.find((item) => item.id === idExpend);
        budgetCurent.listeExpend = budgetCurent.listeExpend.filter((item) => item.id !== idExpend);



        if (curentExpends !== undefined) {

            const newBudgetMontant = curentExpends.type === "add" ? budgetCurent.montant - curentExpends.montant : budgetCurent.montant + curentExpends.montant;

            newBudgets[indexBudget] = budgetCurent;

            DatabaseManager.updateBudgetMontant(budgetCurent.id, newBudgetMontant).then(() => {

                newBudgets[indexBudget].montant = newBudgetMontant;

                dispatch(addExpend(newBudgets));
            });


        } else {
            console.error("curentExpends not found");
        }


    }





    useEffect(() => {

        if (budget.length <= 0) {
            DatabaseManager.getBudget().then((data: budgetInterface[]) => {
                const newPoleExpends: PoleExpend[] = [];

                for (let index = 0; index < data.length; index++) {
                    const pole = data[index];
                    newPoleExpends.push({
                        id: pole.id,
                        nom: pole.name,
                        montant: pole.montant,
                        date: pole.date,
                        montantStart: pole.start_montant,
                        listeExpend: []
                    });

                }

                getExpend(newPoleExpends).then((_data: PoleExpend[]) => {
                    dispatch(addExpend(_data));
                });

            });
        }
    }, [budgetSlice]);


    return (
        <SafeAreaView>

            <ScrollView
                contentContainerStyle={{

                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100%"

                }}
            >

                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {budget.length !== 0 ? budget.map((pole, index) => {
                        return (
                            <SectionCustom key={`${pole.id}-${index}`}>
                                <SectionTitle title={pole.nom} id_budget={pole.id} remaining_budget={pole.montant} budget_start={pole.montantStart} indexBudget={index} ItemAddExpendSlice={ItemAddExpendSlice} />
                                <GenerateListeComponentsItemExpend listeExpend={pole.listeExpend} indexBudget={index} ItemDeleteExpendSlice={ItemDeleteExpendSlice} />
                            </SectionCustom>
                        )
                    })
                        : <View
                            style={{


                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%"

                            }}
                        >
                            <Image source={IconBudgetEmpty} style={{ width: 200, height: 200 }} />
                            <Text

                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: "#000",
                                    textAlign: "center",
                                    lineHeight: 30,

                                }}
                            >Vous devais définir un budget avant de rajouter des transaction </Text>
                        </View>}
                </View>
            </ScrollView>

        </SafeAreaView>
    );

}













async function getExpend(data: PoleExpend[]) {

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        await DatabaseManager.getExpensesByBudget(element.id).then((_data) => {

            data[i].listeExpend = _data;

        });

    }

    return data;
}


export function GenerateListeComponentsItemExpend({ listeExpend, ItemDeleteExpendSlice, indexBudget }: { listeExpend: listeExpendInterface[], ItemDeleteExpendSlice: any, indexBudget: number }) {

    return (
        <>
            {
                listeExpend.length > 0 ?
                    listeExpend.map((item, index) => {
                        return (
                            <ItemBudget key={index} title={item.name} montant={item.montant} id_expend={item.id} name_category={item.category} ItemDeleteExpendSlice={ItemDeleteExpendSlice} indexBudget={indexBudget} type={item.type} />
                        )
                    })
                    : <Text style={{ textAlign: "center" }}>Vous n'avez pas encore d'éléments dans ce budget</Text>

            }

        </>
    )

}




