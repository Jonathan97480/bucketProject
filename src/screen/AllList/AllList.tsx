import { Button } from "@rneui/base";
import { Input } from "@rneui/themed";
import React, { useEffect, useCallback } from "react";
import { View, Text, ScrollView, StatusBar, Alert } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import globalStyle from "../../assets/styleSheet/globalStyle";
import { CustomSafeAreaView } from "../../components";
import { Task } from "./components/Task/Task";
import { addList, addListArray, listInterface } from "../../redux/listSlice";
import DatabaseManager from "../../utils/DataBase";
import ModalListTask from "./components/ModalListTask/ModalListTask";





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

        <CustomSafeAreaView>

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
                                <Text style={[
                                    globalStyle.colorTextPrimary,
                                    globalStyle.textAlignCenter,
                                    globalStyle.textSizeXLarge,
                                ]}>Aucune list</Text>
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
                        style={{
                            color: "#fff",
                        }}
                        onChangeText={(text) => {
                            setNewList(text);
                        }}

                    />
                    <Button
                        title={"Ajouter une liste"}
                        radius={25}
                        buttonStyle={{
                            backgroundColor: "#9C68DD",
                            width: "100%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                        }}

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
        </CustomSafeAreaView>

    );


}

