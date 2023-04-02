import { Button, CheckBox, FAB, Icon, Input } from "@rneui/base";
import React, { useCallback, useEffect } from "react";
import { Alert, TouchableOpacity, View, Text, Modal, ScrollView, FlatList, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StepTask } from "../stepStack/stepStack";
import { addList, listInterface, stepInterface } from "../../../../redux/listSlice";
import { ListAlphabetizeOrder } from "../../../../utils/TextManipulation";
import { addTask, UpdateList } from "../../logic";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { getTrad } from "../../../../lang/internationalization";
import { CustomModal } from "../../../../components";


interface ModalListTaskProps {

    isVisible: boolean,
    setModalIsVisible: (value: boolean) => void,
    index_list: number,

}

export default function ModalListTask({ isVisible, setModalIsVisible, index_list }: ModalListTaskProps) {

    const width = Dimensions.get("window").width;

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
        <CustomModal

            visible={isVisible}
            animationType="slide"
            transparent={true}
            setIsVisible={() => {
                setModalIsVisible(false);
            }}
            disableCenterPosition={true}
            title={allList[index_list].name.substring(0, 1).toUpperCase() + allList[index_list].name.substring(1)}

        >


            <View
                style={{
                    width: "100%",
                    height: "95%",
                }}
            >


                <Input

                    placeholder={getTrad("SearchForItemInList")}
                    inputStyle={{
                        color: "#000",
                        fontSize: width * 0.04,
                        fontWeight: "bold",

                    }}
                    keyboardType="default"


                    rightIcon={
                        <Icon
                            name="search"
                            size={width * 0.05}
                            color="#000"

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

                            />
                        )
                    }}
                />




                <ModalAddTaskList
                    isVisible={modalAddIsVisible}
                    setModalIsVisible={() => {
                        setModalAddIsVisible(false);
                    }}
                    index_list={index_list}
                    allList={allList}


                />

            </View>
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
        </CustomModal >
    )

}


const Filters = React.memo(function ({ filter, setFilter }: { filter: string, setFilter: (value: "checked" | "unchecked") => void }) {

    const width = Dimensions.get("window").width;

    return (
        <View style={[
            globalStyle.containerCheckBox,
            { marginBottom: 20 }
        ]}>
            <CheckBox

                textStyle={[globalStyle.checkBoxText, filter === "unchecked" ? { color: "#007bff" } : { color: "#6c757d" }]}
                containerStyle={globalStyle.checkBox}
                disabledStyle={globalStyle.checkBoxDisabled}

                title={getTrad("UnfinishedTask")}

                checked={filter === "unchecked"}
                onPress={() => {
                    setFilter("unchecked");
                }}

            />

            <CheckBox

                textStyle={[globalStyle.checkBoxText, filter === "checked" ? { color: "#007bff" } : { color: "#6c757d" }]}
                containerStyle={globalStyle.checkBox}
                disabledStyle={globalStyle.checkBoxDisabled}
                title={getTrad("TaskComplete")}
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

}

const ModalAddTaskList = React.memo(({ isVisible, setModalIsVisible, index_list, allList }: ModalAddTaskListProps) => {

    const dispatch = useDispatch();
    const [newItem, setNewItem] = React.useState("");

    const width = Dimensions.get("window").width;

    const addListCallBack = useCallback((_data: listInterface[]) => {

        dispatch(addList(_data));
        setNewItem("");
        setModalIsVisible(false);

    }, []);
    return (
        <CustomModal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            setIsVisible={() => {
                setModalIsVisible(false);
            }}
            title={getTrad("AddTaskToList")}
        >

            <View style={[
                {
                    backgroundColor: "#fff",
                    padding: 15,
                    borderRadius: 10,
                    width: "90%",
                },
            ]}>

                <Input
                    placeholder={getTrad("NewTaskName")}
                    keyboardType="default"
                    inputStyle={{ color: "#000", fontSize: width * 0.04 }}
                    multiline={true}
                    value={newItem}
                    onChange={(e) => {

                        setNewItem(e.nativeEvent.text);
                    }}


                />
                <Button
                    disabled={newItem.length === 0}
                    radius={25}
                    buttonStyle={{
                        backgroundColor: "#007bff",
                        width: "100%",
                        height: width * 0.10,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 10,
                    }}
                    titleStyle={{
                        color: "#fff",
                        fontSize: width * 0.04,
                    }}
                    disabledStyle={{
                        backgroundColor: "#6c757d",
                    }}
                    title={getTrad("AddTask")}
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



        </CustomModal>)

});



