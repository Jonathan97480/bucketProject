import { CheckBox } from "@rneui/themed";
import React from "react";
import { Alert, TouchableOpacity, View, Text } from "react-native";
import { useDispatch } from "react-redux";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { addList, listInterface } from "../../../../redux/listSlice";
import DatabaseManager from "../../../../utils/DataBase";
import { getTrad } from "../../../../lang/internationalization";



export interface TaskProps {
    setCurrentIndexList: (index: number) => void;
    setModalIsVisible: (isVisible: boolean) => void;
    index: number;
    task: listInterface;

}


export const Task = ({ setCurrentIndexList, setModalIsVisible, index, task, }: TaskProps) => {

    const dispatch = useDispatch();



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
                    getTrad("delete"),
                    getTrad("DoYouWantDeleteList"),
                    [
                        {
                            text: getTrad("cancel"),
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: getTrad("yes")
                            , onPress: () => DeleteListe(task.id)
                        }
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
                        padding: 10,

                    }}
                >
                    <CheckBox
                        containerStyle={{
                            backgroundColor: "transparent",
                            borderWidth: 0,
                            marginHorizontal: 0,
                            padding: 0,
                        }}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={checkTaskComplete()}

                    />
                    <Text
                        style={
                            [
                                { textDecorationLine: checkTaskComplete() ? "line-through" : "none" },
                                globalStyle.colorTextPrimary,
                                globalStyle.textSizeSmall,
                                globalStyle.textAlignLeft
                            ]
                        }
                    >{task.name.substring(0, 18)} {getTrad("TaskComplete")} : {task.taskTerminer} / {task.task}</Text>

                </View>
            </View>


        </TouchableOpacity>
    );
    function DeleteListe(id_list: number) {


        DatabaseManager.deleteList(id_list).then(() => {
            DatabaseManager.getAllList().then((data: any) => {
                if (data.length > 0)

                    dispatch(addList(data));
                else
                    dispatch(addList([]));

            });

        });


    }


    function checkTaskComplete() {
        if (task.taskTerminer === task.task && task.task !== 0) {
            return true;
        }
        return false;
    }

};