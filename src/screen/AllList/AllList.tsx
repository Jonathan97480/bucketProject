import { Button } from "@rneui/base";
import { Input } from "@rneui/themed";
import React, { useEffect, useCallback } from "react";
import { View, Text, ScrollView, StatusBar, Alert, FlatList } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import globalStyle from "../../assets/styleSheet/globalStyle";
import { CustomSafeAreaView } from "../../components";
import { Task } from "./components/Task/Task";
import { addList, addListArray, listInterface } from "../../redux/listSlice";
import DatabaseManager from "../../utils/DataBase";
import ModalListTask from "./components/ModalListTask/ModalListTask";
import { getLocales } from 'expo-localization';
import { trad } from "../../lang/internationalization";




export const AllList = () => {
    const local: "FR" | "EN" = getLocales()[0].languageCode === "fr" ? "FR" : "EN";
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


                {
                    list.length > 0 ?

                        <FlatList
                            data={list}
                            keyExtractor={(item: listInterface, index: number) => index.toString() + "-list"}
                            renderItem={({ item, index }: { item: listInterface, index: number }) => {
                                return (
                                    <Task

                                        index={index}
                                        task={item}
                                        setCurrentIndexList={setCurrentIndexList}
                                        setModalIsVisible={setModalIsVisible}
                                        trad={trad[local]}
                                    />
                                )
                            }}
                        /> :
                        <View >
                            <Text style={[
                                globalStyle.colorTextPrimary,
                                globalStyle.textAlignCenter,
                                globalStyle.textSizeXLarge,
                            ]}>{trad[local].NoList}</Text>
                        </View>
                }



                {
                    list.length > 0 && currentIndexList != undefined ?
                        <ModalListTask
                            isVisible={modalIsVisible}
                            index_list={currentIndexList}
                            setModalIsVisible={resetModal}
                            trad={trad[local]}

                        />
                        : null
                }
                <View>
                    <Input
                        placeholder={trad[local].NewListName}
                        value={newList}
                        style={{
                            color: "#fff",
                        }}
                        onChangeText={(text) => {
                            setNewList(text);
                        }}

                    />
                    <Button
                        title={trad[local].AddList}
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
                                Alert.alert("Erreur", trad[local].PleaseEnterNameForList);
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

