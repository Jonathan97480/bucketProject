import { Button, FAB, Icon } from "@rneui/base";
import { Input } from "@rneui/themed";
import React, { useEffect, useCallback, useReducer } from "react";
import { View, Text, ScrollView, StatusBar, Alert, FlatList } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import globalStyle from "../../assets/styleSheet/globalStyle";
import { CustomModal, CustomSafeAreaView } from "../../components";
import { Task } from "./components/Task/Task";
import { addList, addListArray, listInterface } from "../../redux/listSlice";
import DatabaseManager from "../../utils/DataBase";
import ModalListTask from "./components/ModalListTask/ModalListTask";
import { getLocales } from 'expo-localization';
import { trad, getTrad } from "../../lang/internationalization";
import { AddList } from "./logic";




export const AllList = () => {

    const dispatch = useDispatch();
    const list: listInterface[] = useSelector((state: any) => state.list.list);

    const [modalVisible, dispatchModalVisible] = useReducer((state: any, action: {
        type: "ModalListTask" | "ModalCreateList" | "close",
        operation?: any
    }) => {
        switch (action.type) {
            case "ModalListTask":
                return action.type

            case "ModalCreateList":
                return action.type

            case "close":
                return action.type


            default:
                return state;
        }
    }, {
        modalIsVisible: false,
        currentIndexList: undefined,
    });




    const [currentIndexList, setCurrentIndexList] = React.useState<number>();



    function resetModal() {
        dispatchModalVisible({ type: "close" });
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
                                        setModalIsVisible={() => dispatchModalVisible({ type: "ModalListTask" })}

                                    />
                                )
                            }}
                        /> :
                        <View >
                            <Text style={[
                                globalStyle.colorTextPrimary,
                                globalStyle.textAlignCenter,
                                globalStyle.textSizeXLarge,
                            ]}>{getTrad("NoList")}</Text>
                        </View>
                }



                {
                    list.length > 0 && currentIndexList != undefined ?
                        <ModalListTask
                            isVisible={modalVisible === "ModalListTask"}
                            index_list={currentIndexList}
                            setModalIsVisible={resetModal}


                        />
                        : null
                }
                <FAB
                    icon={
                        <Icon
                            name="plus"
                            type="font-awesome-5"
                            color="#fff"
                            size={20}
                        />
                    }
                    onPress={() => {
                        dispatchModalVisible({ type: "ModalCreateList" });
                    }}
                    placement="right"
                />

                <ModalCerateList
                    isVisible={modalVisible === "ModalCreateList"}
                    setModalIsVisible={resetModal}
                />

            </View>
        </CustomSafeAreaView>

    );


}


const ModalCerateList = React.memo(({ isVisible, setModalIsVisible }: { isVisible: boolean, setModalIsVisible: (value: boolean) => void }) => {
    const [newList, setNewList] = React.useState<string>("");
    const dispatch = useDispatch();
    const allList: listInterface[] = useSelector((state: any) => state.list.list);
    return (
        <CustomModal
            visible={isVisible}

            setIsVisible={setModalIsVisible}
            animationType="slide"
            transparent={true} >
            <View style={{ width: "100%" }}>
                <View>
                    <Input
                        placeholder={getTrad("NewListName")}
                        value={newList}
                        style={{
                            color: "black",
                        }}
                        onChangeText={(text) => {
                            setNewList(text);
                        }}

                    />
                    <Button
                        title={getTrad("AddList")}
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
                                Alert.alert("Erreur", getTrad("PleaseEnterNameForList"));
                                return;
                            }



                            AddList({
                                nameList: newList,
                                allList: allList,
                            }).then((res) => {
                                if (!res.alert) {
                                    dispatch(addListArray(res.list));
                                    setNewList("");
                                    setModalIsVisible(false);
                                } else {
                                    Alert.alert(res.alert.alert?.type || "", res.alert.alert?.message,
                                        [
                                            {
                                                text: getTrad("ok"),
                                                onPress: () => { },
                                            },
                                            {
                                                text: getTrad("cancel"),
                                                onPress: () => { },
                                                style: "cancel"
                                            }



                                        ]);
                                }

                            });
                        }}
                    />
                </View>
            </View>

        </CustomModal>
    )
})