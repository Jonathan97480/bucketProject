import { Button, CheckBox } from "@rneui/base";
import { Input } from "@rneui/themed";
import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Modal, Alert, NativeSyntheticEvent } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { addList, listInterface } from "../redux/listSlice";
import { colorList } from "../utils/ColorCollection";
import DatabaseManager from "../utils/DataBase";
import { fixedFloatNumber } from "../utils/ExpendManipulation";
import { CreateDateCurentString, textSizeFixe } from "../utils/TextManipulation";




export const AllList = () => {

    const dispatch = useDispatch();
    const list: listInterface[] = useSelector((state: any) => state.list.list);
    const [modalIsVisible, setModalIsVisible] = React.useState(false);
    const [currentIndexList, setCurrentIndexList] = React.useState<number>();


    function resetModal() {
        setModalIsVisible(false);
        setCurrentIndexList(undefined);
    }

    useEffect(() => {
        if (list.length === 0) {
            DatabaseManager.getAllList().then((data: any) => {
                if (data.length > 0)

                    dispatch(addList(data));
            });
        }

    }, [list]);


    return (

        <SafeAreaView>

            <StatusBar barStyle="default" />
            <ScrollView contentContainerStyle={{
                padding: 10,
            }}>

                {
                    list.length > 0 ?
                        list.map((item: listInterface, index: number) => {
                            return (
                                <TouchableOpacity key={index + "-list"}
                                    style={{
                                        marginVertical: 5,
                                    }}
                                    onPress={() => {

                                        setCurrentIndexList(index);
                                        setModalIsVisible(true);
                                    }}
                                    onLongPress={() => {

                                        Alert.alert(
                                            "Supprimer",
                                            "Voulez vous supprimer cette liste ?",
                                            [
                                                {
                                                    text: "Annuler",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                { text: "OK", onPress: () => DeleteListe(item.id) }
                                            ],)

                                    }}
                                >
                                    <View
                                        style={{

                                            backgroundColor: "#373737",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderRadius: 50,


                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            <CheckBox
                                                containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                                                checkedIcon="dot-circle-o"
                                                uncheckedIcon="circle-o"
                                                checked={item.taskTerminer === item.task}

                                            />
                                            <Text
                                                style={
                                                    {
                                                        color: "white",
                                                        textDecorationLine: item.taskTerminer === item.task ? "line-through" : "none",
                                                    }
                                                }
                                            >{textSizeFixe(item.name, 20)}</Text>
                                        </View>

                                        <Text style={{
                                            fontSize: 12,
                                            textAlign: "center",
                                            marginBottom: 5,
                                            marginRight: 10,
                                            color: "white",
                                            textDecorationLine: item.taskTerminer === item.task ? "line-through" : "none",

                                        }}
                                        >Tache terminer : {item.taskTerminer} / {item.task}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                        :
                        <View >
                            <Text>Aucune list</Text>
                        </View>
                }

            </ScrollView>

            {
                list.length > 0 && currentIndexList != undefined ?
                    <ModalListTask
                        isVisible={modalIsVisible}
                        index_list={currentIndexList}
                        setModalIsVisible={resetModal}

                    />
                    : null
            }
        </SafeAreaView>

    );

    function DeleteListe(id_list: number) {

        DatabaseManager.getIdBudgetByListId(id_list).then((id_budget: any) => {
            DatabaseManager.deleteList(id_list, id_budget).then(() => {
                DatabaseManager.getAllList().then((data: any) => {
                    if (data.length > 0)

                        dispatch(addList(data));
                    else
                        dispatch(addList([]));

                });

            });
        });

    }
}


interface ModalListTaskProps {

    isVisible: boolean,
    setModalIsVisible: (value: boolean) => void,
    index_list: number,
}

function ModalListTask({ isVisible, setModalIsVisible, index_list }: ModalListTaskProps) {

    const dispatch = useDispatch();
    const allList = useSelector((state: any) => state.list.list);
    const list: listInterface = allList[index_list];
    const [newItem, setNewItem] = React.useState("");

    const handleKeyPress = (e: any) => {
        let key = e.nativeEvent.key;
        console.log(key)
    };

    return (
        <Modal

            visible={isVisible}
            animationType="slide"
            onRequestClose={() => {
                setModalIsVisible(false);
            }}


        >
            <View style={{ flex: 1, justifyContent: "space-between", paddingTop: 20, maxHeight: "100%" }}>

                <Text
                    style={{
                        fontSize: 30,
                        textAlign: "center",
                        marginBottom: 5,
                        marginRight: 10,
                        fontWeight: "bold",
                    }}

                >{list.name}</Text>
                <ScrollView>
                    {


                        list.items.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index + "-item"}
                                    onLongPress={() => {
                                        Alert.alert(
                                            "Supprimer",
                                            "Voulez vous supprimer cette tache ?",
                                            [
                                                {
                                                    text: "Annuler",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                { text: "OK", onPress: () => deleteTask(index) }
                                            ],)

                                    }}
                                    onPress={() => {

                                        UpdateList(!item.isChecked, index);
                                    }}



                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                            backgroundColor: item.isChecked ? "green" : "white",
                                            padding: 10,
                                            borderBottomWidth: 1,
                                            borderBottomColor: "grey",

                                        }}
                                    >
                                        <CheckBox
                                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                                            center

                                            checkedIcon="dot-circle-o"
                                            uncheckedIcon="circle-o"
                                            checked={item.isChecked}

                                        />
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                flex: 1,
                                            }}
                                        >
                                            <Text>{item.name}</Text>
                                            <Text>{item.quantity > 0 ? `quantité :${item.quantity}` : ""}</Text>
                                        </View>

                                    </View>


                                </TouchableOpacity>
                            )
                        })

                    }
                </ScrollView>
                <View>
                    <Text>Ajouter une tache</Text>
                    <Input
                        placeholder="Nom de la tache"
                        keyboardType="default"
                        value={newItem}
                        onChange={(e) => {

                            setNewItem(e.nativeEvent.text);
                        }}

                    />
                    <Button
                        disabled={newItem.length === 0}
                        title="Ajouter"
                        onPress={() => {
                            if (newItem.length > 0) {
                                addTask(newItem)
                                setNewItem("");

                            }
                        }}
                    />
                </View>
            </View>



        </Modal >
    )


    function UpdateList(isChecked: boolean, index: number, ItemArray?: any) {

        let newItemArray = ItemArray ? [...ItemArray] : [...list.items];
        newItemArray[index] = {
            ...newItemArray[index],
            isChecked: isChecked
        }


        DatabaseManager.updateList({
            id: list.id,
            name: list.name,
            montant: list.montant,
            date: list.date,
            items: newItemArray,
            validate: list.validate,
            task: newItemArray.length,


        }).then(() => {

            DatabaseManager.getAllList().then((data: any) => {
                if (data.length > 0)

                    dispatch(addList(data));
            }).catch((error: any) => {
                console.log(error);
            });

        });

    }

    function addTask(value: string) {

        let newItemArray = [...list.items];
        newItemArray.push({
            id: 0,
            name: value,
            quantity: 0,
            isChecked: false,
            date: CreateDateCurentString(),
            montant: 0,
            category: "autre",
            type: "achat",
        });

        UpdateList(false, newItemArray.length - 1, newItemArray);

    }

    function deleteTask(index: number) {

        let newItemArray = [...list.items];
        newItemArray.splice(index, 1);

        UpdateList(false, newItemArray.length - 1, newItemArray);

    }

}
