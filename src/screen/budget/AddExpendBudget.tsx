import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Input } from "@rneui/base";
import { addExpend, listeExpendInterface, PoleExpend } from '../../redux/expendSlice';
import { useRoute } from '@react-navigation/native';
import { SectionCustom } from "../../components/SectionCustom/SectionCustom";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { ItemBudget } from "../../components/ItemBudget/ItemBudget";
import { getAllExpend } from "../../utils/GetBudgetAndExpend";
import { ExpendArrayAlphabetizeOrder } from "../../utils/TextManipulation";





export const AddExpendBudget = () => {

    const dispatch = useDispatch();

    const budget: PoleExpend[] = useSelector((state: any) => state.expend.expends);

    const route = useRoute();

    const { indexBudget } = route.params as { indexBudget: number };

    const [curentBudget, setCurentBudget] = React.useState<PoleExpend>(budget[indexBudget]);

    useEffect(() => {

        if (budget.length <= 0) {

            getAllExpend().then((data) => {
                if (data.length > 0) {
                    dispatch(addExpend(data));
                }
            });


        }

        setCurentBudget(budget[indexBudget]);
    }, [budget]);


    return (

        <SafeAreaView>

            <StatusBar barStyle="default" />
            <ScrollView contentContainerStyle={styles.scrollView}>

                <View style={styles.container} >


                    <SectionCustom >
                        <SectionTitle title={curentBudget.nom} id_budget={curentBudget.id} remaining_budget={curentBudget.montant} budget_start={curentBudget.montantStart} indexBudget={indexBudget} />
                        <GenerateListeComponentsItemExpend listeExpend={curentBudget.listeExpend} indexBudget={indexBudget} idBudget={curentBudget.id} isFilter={true} />
                    </SectionCustom>


                </View>
            </ScrollView>

        </SafeAreaView >

    );

}

const styles = StyleSheet.create({
    scrollView: {

        justifyContent: 'flex-start',
        alignItems: "center",
        minHeight: "100%",
        maxWidth: "100%",
        paddingTop: 20,

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
    idBudget: number
    isFilter?: boolean
}


export function GenerateListeComponentsItemExpend({ listeExpend, indexBudget, idBudget, isFilter }: GenerateListeComponentsItemExpendProps) {

    const [NewListeExpend, setNewListeExpend] = React.useState<listeExpendInterface[]>(ExpendArrayAlphabetizeOrder([...listeExpend]));

    useEffect(() => {

        setNewListeExpend(ExpendArrayAlphabetizeOrder([...listeExpend]));

    }, [listeExpend]);



    return (
        <>
            <View>
                <Input
                    style={{ width: "100%", marginBottom: 20 }}
                    placeholder="Rechercher"
                    onChangeText={(text) => {
                        if (text.length > 0) {

                            rechercheExpendByName(text).then((data) => {
                                setNewListeExpend(ExpendArrayAlphabetizeOrder([...data]));
                            });

                        } else {
                            setNewListeExpend(ExpendArrayAlphabetizeOrder([...listeExpend]));
                        }
                    }}

                    rightIcon={
                        <Icon
                            name="search"
                            size={20}
                            color="#000"

                        />
                    }

                />
            </View>
            {
                NewListeExpend.length > 0 ?
                    NewListeExpend.map((item, index) => {
                        return (
                            <ItemBudget
                                key={item.id + "-" + index + "-NewListeExpend"}
                                indexBudget={indexBudget}
                                expend={item}
                                idBudget={idBudget}
                            />

                        )
                    })
                    : <Text style={{ textAlign: "center" }}>Vous n'avez pas encore d'éléments dans ce budget</Text>

            }

        </>
    )


    async function rechercheExpendByName(name: string) {

        const _newListeExpend = listeExpend.filter((item) => {
            return item.name.toLowerCase().includes(name.toLowerCase());
        });

        return _newListeExpend;

    }

}




