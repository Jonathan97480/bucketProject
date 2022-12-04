
import { Button, ListItem } from "@rneui/base";
import { Icon } from "@rneui/themed";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from 'react-redux';
import { EmptyBudget } from "../components/EmptyBudget";
import { InfoModal } from "../components/InfoBudget";
import { ModalAddBudget } from "../components/ModalAddBudget";
import { addExpend, PoleExpend } from "../redux/expendSlice";
import { colorList, getColorBudget } from "../utils/ColorCollection";
import DatabaseManager from "../utils/DataBase";
import { getAllExpend } from "../utils/GetBudgetAndExpend";



interface curentBudgetInterface {
    budget: PoleExpend;
    indexBudget: number;
}


export const Budget = () => {

    const budget: PoleExpend[] = useSelector((state: any) => state.expend.expends);
    const [curentBudget, setCurentBudget] = React.useState<curentBudgetInterface>({
        budget: {
            id: 0,
            montant: 0,
            listeExpend: [],
            nom: "",
            date: "",
            montantStart: 0,
        }, indexBudget: 0
    });

    const dispatch = useDispatch();

    const [isViewModalAddBudget, setIsViewModalAddBudget] = React.useState(false);
    const [isViewModalInfo, setIsViewModalInfo] = React.useState(false);



    useEffect(() => {
        if (budget.length <= 0) {
            getAllExpend().then((_data) => {
                if (_data !== undefined && _data !== null && _data.length > 0) {
                    dispatch(addExpend(_data));
                }
            });
        }

    }, [budget]);




    return (
        <SafeAreaView
            style={styles.safeAreaView}
        >
            <View style={styles.container}>

                {

                    budget.length > 0 ?
                        <ScrollView contentContainerStyle={styles.scrollView}>
                            <View
                                style={styles.scrollViewContainer}
                            >
                                <Text style={styles.title} >
                                    Liste Des budget
                                </Text>
                                {
                                    budget.map((item: PoleExpend, indexBudget) => {
                                        return (


                                            <View style={{
                                                marginVertical: 5,
                                                height: "auto",

                                            }} key={item.id}
                                            >

                                                <BudgetSwipeableElement
                                                    budget={item}
                                                    indexBudget={indexBudget}
                                                    setCurentBudget={setCurentBudget}
                                                    setIsViewModalInfo={setIsViewModalInfo}
                                                />
                                            </View>

                                        )

                                    })
                                }
                                <Button
                                    buttonStyle={styles.buttonAddBudget}
                                    title="Ajouter"
                                    icon={
                                        <Icon
                                            name="plus"
                                            type='font-awesome'
                                            color={colorList.primary}
                                        />
                                    }
                                    onPress={() => setIsViewModalAddBudget(true)}
                                />

                            </View>

                        </ScrollView>
                        : <EmptyBudget setIsViewModalAddBudget={setIsViewModalAddBudget} />

                }


                <ModalAddBudget isViewModalAddBudget={isViewModalAddBudget} setIsViewModalAddBudget={setIsViewModalAddBudget}
                />
            </View>


            <InfoModal
                IsViewModalInfo={isViewModalInfo}
                setIsViewModalInfo={setIsViewModalInfo}
                budget={curentBudget.budget}
                indexBudget={curentBudget.indexBudget}
            />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    safeAreaView: {
        maxHeight: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        paddingVertical: 10,
        maxHeight: '100%',
        justifyContent: 'center',
        padding: 10,
        height: '100%',
    },

    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        minHeight: '100%',
        width: '100%',
        padding: 10,
    },
    scrollViewContainer: {
        width: '100%',
        height: '100%',
        marginTop: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonAddBudget: {

        flex: 1,
        borderRadius: 50,
        backgroundColor: '#596cab',
    }

});




interface BudgetSwipeableElementProps {
    budget: PoleExpend;
    indexBudget: number;
    setCurentBudget: (value: curentBudgetInterface) => void;
    setIsViewModalInfo: (value: boolean) => void;
}


function BudgetSwipeableElement({ budget, indexBudget, setCurentBudget, setIsViewModalInfo }: BudgetSwipeableElementProps) {

    const dispatch = useDispatch();

    return (
        <ListItem.Swipeable

            containerStyle={[{ backgroundColor: getColorBudget(budget.montant, budget.montantStart), borderRadius: 20, }]}

            leftContent={(reset) => (
                <Button
                    containerStyle={{ borderRadius: 20, }}
                    title="Info"
                    onPress={() => {
                        setCurentBudget({ budget: budget, indexBudget });
                        setIsViewModalInfo(true);
                        reset()
                    }}
                    icon={{ name: 'info', color: 'white' }}
                    buttonStyle={{ minHeight: '100%' }}
                />
            )}
            rightContent={(reset) => (
                <Button
                    containerStyle={{ borderRadius: 20, }}
                    title="Delete"
                    onPress={() => {
                        reset()
                        DatabaseManager.deleteAllExpendByBudget(budget.id).then(() => {

                            DatabaseManager.deleteBudget(budget.id).then(() => {

                                getAllExpend().then((_data) => {
                                    console.log("DATA TEST12 ", _data);
                                    if (_data.length > 0) {
                                        dispatch(addExpend(_data));
                                    } else {
                                        dispatch(addExpend([]));
                                    }
                                });


                            });

                        });

                    }
                    }
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
            )}
        >
            <Icon
                name="dollar"
                type='font-awesome'
                color={colorList.primary}
            />
            <ListItem.Content

            >
                <ListItem.Title
                    style={{ color: colorList.primary }}
                >{budget.nom}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem.Swipeable>
    )

}










