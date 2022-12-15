import { CheckBox } from "@rneui/base";
import React from "react";
import { Alert, TouchableOpacity, View, Text } from "react-native";
import { listInterface, stepInterface } from "../../redux/listSlice";




export interface StepTaskProps {
    UpdateList: (isChecked: boolean, index: number, steps?: stepInterface[]) => void;
    index: number;
    step: stepInterface;
    task: listInterface;
}


export const StepTask = ({ UpdateList, index, step, task }: StepTaskProps) => {


    return (
        <TouchableOpacity

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

                UpdateList(!step.isChecked, index);
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
                        }}
                    >{step.name}</Text>
                    <Text
                        style={{
                            color: "#fff",
                            textDecorationLine: step.isChecked ? "line-through" : "none",
                        }}
                    >{step.quantity > 0 ? `quantité :${step.quantity}` : ""}</Text>
                </View>

            </View>


        </TouchableOpacity>
    )
    function deleteTask(index: number) {

        let newStepArray = [...task.steps];
        newStepArray.splice(index, 1);

        UpdateList(false, newStepArray.length - 1, newStepArray);

    }
}