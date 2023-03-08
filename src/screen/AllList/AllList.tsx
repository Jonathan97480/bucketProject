import { Button, CheckBox, Icon } from "@rneui/base";
import { Input } from "@rneui/themed";
import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Modal, Alert } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { StepTask } from "../../components/stepStack/stepStack";
import { Task } from "../../components/Task/Task";
import { addList, addListArray, listInterface } from "../../redux/listSlice";
import DatabaseManager from "../../utils/DataBase";
import { CreateDateCurentString, ListAlphabetizeOrder } from "../../utils/TextManipulation";




export const AllList = () => {

    const dispatch = useDispatch();
    const list: listInterface[] = useSelector((state: any) => state.list.list);
    const [modalIsVisible, setModalIsVisible] = React.useState(false);
    const [currentIndexList, setCurrentIndexList] = React.useState<number>();
    const [newList, setNewList] = React.useState<string>("");


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
            <View style={{

                maxHeight: "100%",
                minHeight: "100%",

            }}>
                <ScrollView contentContainerStyle={{
                    padding: 10,
                }}>

                    {
                        list.length > 0 ?
                            list.map((item: listInterface, index: number) => {
                                return (
                                    <Task
                                        key={index + "-list"}
                                        index={index}
                                        task={item}
                                        setCurrentIndexList={setCurrentIndexList}
                                        setModalIsVisible={setModalIsVisible}
                                    />
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
                <View>
                    <Input
                        placeholder="nom de la nouvelle liste"
                        value={newList}
                        onChangeText={(text) => {
                            setNewList(text);
                        }}

                    />
                    <Button
                        title={"Ajouter une liste"}
                        onPress={() => {
                            if (newList.length === 0) {
                                Alert.alert("Erreur", "Veuillez entrer un nom pour la liste");
                                return;
                            }

                            DatabaseManager.createList(newList).then((data: listInterface) => {
                                dispatch(addListArray(data));
                                setNewList("");
                            });
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>

    );


}


interface ModalListTaskProps {

    isVisible: boolean,
    setModalIsVisible: (value: boolean) => void,
    index_list: number,
}

function ModalListTask({ isVisible, setModalIsVisible, index_list }: ModalListTaskProps) {

    const dispatch = useDispatch();
    const allList = useSelector((state: any) => state.list.list);
    let list: listInterface = { ...allList[index_list], steps: [...allList[index_list].steps] };
    let steps = ListAlphabetizeOrder(list.steps);
    list.steps = [...steps];
    const [curentList, setCurentList] = React.useState(list);
    const [newItem, setNewItem] = React.useState("");


    useEffect(() => {
        list = { ...allList[index_list], steps: [...allList[index_list].steps] };
        steps = ListAlphabetizeOrder(list.steps);
        list.steps = [...steps];
        setCurentList(list);
    }, [allList]);


    return (
        <Modal

            visible={isVisible}
            animationType="slide"
            onRequestClose={() => {
                setModalIsVisible(false);
            }}


        >
            <View style={{ flex: 1, justifyContent: "space-between", padding: 15, paddingTop: 20, maxHeight: "100%", }}>

                <Text
                    style={{
                        fontSize: 30,
                        textAlign: "center",
                        marginBottom: 5,
                        marginRight: 10,
                        fontWeight: "bold",
                    }}

                >{list.name}</Text>

                <Input
                    label="Rechercher"
                    placeholder="rechercher une element dans la liste"
                    keyboardType="default"
                    rightIcon={
                        <Icon
                            name="search"
                            size={30}
                            color="black"

                        />
                    }
                    onChange={(e) => {
                        let text = e.nativeEvent.text;
                        let newList = list.steps.filter((item) => {
                            return item.name.toLowerCase().includes(text.toLowerCase());
                        });

                        setCurentList({ ...list, steps: newList });
                    }}

                />
                <ScrollView>
                    {


                        curentList.steps.map((item, index) => {
                            return (
                                <StepTask
                                    key={index + "-step"}
                                    index={index}
                                    step={item}
                                    UpdateList={UpdateList}
                                    task={list}
                                />
                            )
                        })

                    }
                </ScrollView>
                <View>
                    <Text>Ajouter une tache</Text>
                    <Input
                        placeholder="Nom de la nouvelle tache"
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


    function UpdateList(isChecked: boolean, id: number, ItemArray?: any) {

        let newItemArray = ItemArray ? [...ItemArray] : [...list.steps];
        let index = newItemArray.findIndex((item) => item.id === id);
        newItemArray[index] = {
            ...newItemArray[index],
            isChecked: isChecked
        }


        DatabaseManager.updateList({
            id: list.id,
            name: list.name,
            montant: list.montant,
            date: list.date,
            steps: newItemArray,
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

        let newItemArray = [...list.steps];
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



}
