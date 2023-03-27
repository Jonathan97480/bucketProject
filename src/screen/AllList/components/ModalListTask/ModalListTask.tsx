import { Button, CheckBox, FAB, Icon, Input } from "@rneui/base";
import React, { useCallback, useEffect } from "react";
import { Alert, TouchableOpacity, View, Text, Modal, ScrollView, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StepTask } from "../stepStack/stepStack";
import { addList, listInterface, stepInterface } from "../../../../redux/listSlice";
import { ListAlphabetizeOrder } from "../../../../utils/TextManipulation";
import { addTask, UpdateList } from "../../logic";
import globalStyle from "../../../../assets/styleSheet/globalStyle";



interface ModalListTaskProps {

    isVisible: boolean,
    setModalIsVisible: (value: boolean) => void,
    index_list: number,
    trad: any,
}

export default function ModalListTask({ isVisible, setModalIsVisible, index_list, trad }: ModalListTaskProps) {

    const dispatch = useDispatch();

    const allList: listInterface[] = useSelector((state: any) => state.list.list);

    const [modalAddIsVisible, setModalAddIsVisible] = React.useState(false);

    const [steps, setSteps] = React.useState({
        checked: [] as stepInterface[],
        unchecked: [] as stepInterface[],
    });

    const [filter, setFilter] = React.useState("unchecked" as "checked" | "unchecked");



    const organizedSteps = React.useMemo(() => {
        setSteps(organizeSteps(allList[index_list].steps))
    },
        [allList]);

    useEffect(() => {
        organizedSteps;
    }, [allList]);





    return (
        <Modal

            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                setModalIsVisible(false);
            }}


        >
            <View style={[
                {
                    flex: 1,
                    justifyContent: "space-between",
                    padding: 15,
                    paddingTop: 20,
                    maxHeight: "100%",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                },
                globalStyle.backgroundTrinaryColor,

            ]}>

                <Text
                    style={[
                        globalStyle.textAlignCenter,
                        globalStyle.textSizeXLarge,
                        globalStyle.colorTextPrimary,

                        {
                            marginBottom: 20,
                        }
                    ]}

                >{allList[index_list].name}</Text>

                <Input
                    label={trad.ToResearch}
                    placeholder={trad.SearchForItemInList}
                    keyboardType="default"
                    style={globalStyle.colorTextPrimary}
                    labelStyle={{
                        color: "#fff",
                    }}
                    rightIcon={
                        <Icon
                            name="search"
                            size={30}
                            color="#fff"

                        />
                    }
                    onChange={(e) => {
                        let text = e.nativeEvent.text;
                        let newList = allList[index_list].steps.filter((item) => {
                            return item.name.toLowerCase().includes(text.toLowerCase());
                        });

                        setSteps(organizeSteps(newList));
                    }}

                />
                <Filters
                    filter={filter}
                    setFilter={setFilter}
                    trad={trad}
                />

                <FlatList
                    data={steps[filter]}
                    keyExtractor={(item, index) => index + "-step"}
                    renderItem={({ item, index }) => {
                        return (
                            <StepTask

                                index={index}
                                step={item}
                                UpdateList={UpdateList}
                                task={allList[index_list]}
                                trad={trad}
                            />
                        )
                    }}
                />
                <FAB
                    style={{}}
                    placement="right"
                    color="#9c68dd"
                    icon={
                        <Icon
                            name="plus"
                            type="font-awesome-5"
                            size={20}
                            color="#fff"
                        />
                    }
                    onPress={() => {
                        setModalAddIsVisible(true);
                    }}
                />

            </View>

            <ModalAddTaskList
                isVisible={modalAddIsVisible}
                setModalIsVisible={() => {
                    setModalAddIsVisible(false);
                }}
                index_list={index_list}
                allList={allList}
                trad={trad}

            />


        </Modal >
    )

}


const Filters = React.memo(function ({ filter, setFilter, trad }: { filter: string, setFilter: (value: "checked" | "unchecked") => void, trad: any }) {

    return (
        <View style={[
            globalStyle.containerCheckBox,
            { marginBottom: 20 }
        ]}>
            <CheckBox

                textStyle={globalStyle.checkBoxText}
                containerStyle={globalStyle.checkBox}
                disabledStyle={globalStyle.checkBoxDisabled}

                title={trad.UnfinishedTask}
                checked={filter === "unchecked"}
                onPress={() => {
                    setFilter("unchecked");
                }}

            />

            <CheckBox

                textStyle={globalStyle.checkBoxText}
                containerStyle={globalStyle.checkBox}
                disabledStyle={globalStyle.checkBoxDisabled}
                title={trad.TaskComplete}
                checked={filter === "checked"}
                onPress={() => {
                    setFilter("checked");
                }}

            />

        </View>
    )

});

function organizeSteps(list: stepInterface[]) {

    let steps = {
        checked: [] as stepInterface[],
        unchecked: [] as stepInterface[],
    }

    list.forEach((item) => {
        if (item.isChecked) {
            steps.checked.push(item);
        } else {
            steps.unchecked.push(item);
        }
    });

    steps.checked = ListAlphabetizeOrder(steps.checked);
    steps.unchecked = ListAlphabetizeOrder(steps.unchecked);

    return steps;

}


interface ModalAddTaskListProps {
    isVisible: boolean,
    setModalIsVisible: (value: boolean) => void,
    index_list: number,
    allList: listInterface[],
    trad: any
}

const ModalAddTaskList = React.memo(({ isVisible, setModalIsVisible, index_list, allList, trad }: ModalAddTaskListProps) => {

    const dispatch = useDispatch();
    const [newItem, setNewItem] = React.useState("");

    const addListCallBack = useCallback((_data: listInterface[]) => {

        dispatch(addList(_data));
        setNewItem("");
        setModalIsVisible(false);

    }, []);
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                setModalIsVisible(false);
            }}
        >

            <View style={
                {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",

                }
            }>

                <View style={[
                    {
                        backgroundColor: "#fff",
                        padding: 15,
                        borderRadius: 10,
                        width: "90%",
                    },
                ]}>
                    <Text
                        style={[
                            globalStyle.textAlignLeft,
                            globalStyle.textSizeMedium,
                            globalStyle.colorTextPrimary,
                        ]}
                    >{trad.AddTaskToList}</Text>
                    <Input
                        placeholder={trad.NewTaskName}
                        keyboardType="default"
                        style={{ color: "#000" }}
                        value={newItem}
                        onChange={(e) => {

                            setNewItem(e.nativeEvent.text);
                        }}

                    />
                    <Button
                        disabled={newItem.length === 0}
                        radius={25}
                        buttonStyle={{
                            backgroundColor: "#9C68DD",
                            width: "100%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                        }}
                        disabledStyle={{
                            backgroundColor: "rgba(156, 104, 221, 0.42)",
                        }}
                        title={trad.AddTask}
                        onPress={async () => {
                            if (newItem.length > 0) {
                                const AllList = await addTask({
                                    value: newItem,
                                    list: allList[index_list]
                                });

                                addListCallBack(AllList);


                            }
                        }}
                    />
                </View>
            </View>


        </Modal>)

});



