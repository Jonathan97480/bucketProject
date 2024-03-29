import { CheckBox } from "@rneui/base";
import React from "react";
import { Alert, TouchableOpacity, View, Text, Dimensions } from "react-native";
import { addList, listInterface, stepInterface } from "../../../../redux/listSlice";
import { useDispatch } from "react-redux";
import { getTrad } from "../../../../lang/internationalization";




export interface StepTaskProps {
    UpdateList: ({
        isChecked,
        id,
        ItemArray,
        list
    }: {
        isChecked: boolean,
        id: number,
        ItemArray?: any,
        list: listInterface
    }) => Promise<listInterface[]>;

    index: number;
    step: stepInterface;
    task: listInterface;


}


export const StepTask = ({ UpdateList, index, step, task }: StepTaskProps) => {

    const dispatch = useDispatch();
    const { width } = Dimensions.get("window");
    return (
        <TouchableOpacity

            onLongPress={() => {
                Alert.alert(
                    getTrad("delete"),
                    getTrad("DoYouWantDeleteThisTask"),
                    [
                        {
                            text: getTrad("cancel"),
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: getTrad("yes"), onPress: () => deleteTask(index) }
                    ],)

            }}
            onPress={async () => {

                const newAllList = await UpdateList({
                    isChecked: !step.isChecked,
                    id: step.id,
                    list: task,
                });

                dispatch(addList(newAllList));

            }}



        >
            <View
                style={{
                    backgroundColor: "#373737",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 50,
                    paddingHorizontal: 10,
                    marginVertical: 5,

                }}
            >
                <CheckBox
                    containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                    center
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={step.isChecked}

                />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            textDecorationLine: step.isChecked ? "line-through" : "none",
                            fontSize: width * 0.04,
                        }}
                    >{step.name}</Text>
                    <Text
                        style={{
                            color: "#fff",
                            textDecorationLine: step.isChecked ? "line-through" : "none", fontSize: width * 0.04,
                        }}
                    >{step.quantity > 0 ? `${getTrad("Quantity")} :${step.quantity}` : ""}</Text>
                </View>

            </View>


        </TouchableOpacity>
    )
    async function deleteTask(index: number) {

        let newStepArray = [...task.steps];
        let stepID = newStepArray[index].id;
        newStepArray.splice(index, 1);

        const newAllList = await UpdateList({
            isChecked: false,
            id: stepID,
            ItemArray: newStepArray,
            list: task,
        });

        dispatch(addList(newAllList));


    }
}