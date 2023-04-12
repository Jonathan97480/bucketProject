import { Button, FAB, Icon } from "@rneui/base";
import { Input } from "@rneui/themed";
import React, { useEffect, useReducer } from "react";
import { View, Text, Alert, FlatList, Dimensions } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import globalStyle from "../../assets/styleSheet/globalStyle";
import { BannerAds, CustomModal, CustomSafeAreaView } from "../../components";
import { Task } from "./components/Task/Task";
import { addList, addListArray, listInterface } from "../../redux/listSlice";
import DatabaseManager from "../../utils/DataBase";
import ModalListTask from "./components/ModalListTask/ModalListTask";
import { getTrad } from "../../lang/internationalization";
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

            <BannerAds

                key="ca-app-pub-2398424925470703/5056008601"
            />
            <View style={{

                flex: 1,


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
                    color="#17a2b8"
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
    const width = Dimensions.get("window").width;
    return (
        <CustomModal
            visible={isVisible}
            backgroundColor='#282525'
            setIsVisible={setModalIsVisible}
            animationType="slide"
            transparent={true}
            title={getTrad("AddList")}
            titleStyle={globalStyle.titleStyle}
            containerStyle={globalStyle.modalContainerStyleForm}
        >
            <View style={{ width: "100%" }}>
                <View style={{ padding: 15 }}>
                    <Input
                        placeholder={getTrad("NewListName")}
                        value={newList}
                        label={getTrad("NewListName")}
                        labelStyle={globalStyle.labelStyle}
                        inputStyle={globalStyle.inputStyle}
                        inputContainerStyle={globalStyle.inputContainerStyle}
                        onChangeText={(text) => {
                            setNewList(text);
                        }}

                    />
                    <View
                        style={{
                            width: "100%",
                            alignItems: "center",
                            marginVertical: 10,
                        }}
                    >
                        <Button
                            title={getTrad("AddList")}
                            radius={25}
                            titleStyle={globalStyle.btnTitleStyle}
                            containerStyle={globalStyle.btnContainerStyle}
                            buttonStyle={globalStyle.btnStyle}
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
            </View>

        </CustomModal>
    )
})