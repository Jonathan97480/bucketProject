import { Button, Icon, Input } from "@rneui/base";
import React, { useCallback, useEffect } from "react";
import { Alert, TouchableOpacity, View, Text, Modal, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StepTask } from "../stepStack/stepStack";
import { addList, listInterface } from "../../../../redux/listSlice";
import { ListAlphabetizeOrder } from "../../../../utils/TextManipulation";
import { addTask, UpdateList } from "../../logic";
import globalStyle from "../../../../assets/styleSheet/globalStyle";



interface ModalListTaskProps {

    isVisible: boolean,
    setModalIsVisible: (value: boolean) => void,
    index_list: number,
}

export default function ModalListTask({ isVisible, setModalIsVisible, index_list }: ModalListTaskProps) {

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


    const addListCallBack = useCallback((_data: listInterface[]) => {

        dispatch(addList(_data));
        setNewItem("");

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

                >{list.name}</Text>

                <Input
                    label="Rechercher"
                    placeholder="rechercher une element dans la liste"
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
                    <Text
                        style={[
                            globalStyle.textAlignLeft,
                            globalStyle.textSizeMedium,
                            globalStyle.colorTextPrimary,
                        ]}
                    >Ajouter une tache à la liste</Text>
                    <Input
                        placeholder="Nom de la nouvelle tache"
                        keyboardType="default"
                        style={globalStyle.colorTextPrimary}
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
                        title="Ajouter une tache"
                        onPress={async () => {
                            if (newItem.length > 0) {
                                const AllList = await addTask({
                                    value: newItem,
                                    list: list
                                });

                                addListCallBack(AllList);


                            }
                        }}
                    />
                </View>
            </View>



        </Modal >
    )

}
