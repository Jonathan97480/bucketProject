import { Button, CheckBox } from "@rneui/base";
import React, { useState } from "react";
import { View, Text, Modal } from "react-native";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { TransactionMonthInterface } from "../../../../redux/comptesSlice";
import { CreateListe } from "./logic";
import { useDispatch } from "react-redux";
import { addListArray } from "../../../../redux/listSlice";


interface ModalCreateListeProps {
    budget: TransactionMonthInterface;
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;

}



export default function ModalCreateListe({ budget, isVisible, setIsVisible }: ModalCreateListeProps) {

    const [selectorElements, setSelectorElements] = useState<'All' | 'Income' | 'Expense'>('All');
    const dispatch = useDispatch();


    return (
        <Modal
            animationType="slide"
            visible={isVisible}
            transparent={true}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}

            >

                <View
                    style={{ backgroundColor: "#fff", width: "90%", borderRadius: 10, padding: 10 }}
                >
                    <Text
                        style={[
                            globalStyle.textAlignCenter,
                            globalStyle.textSizeLarge,
                            globalStyle.marginVertical
                        ]}
                    >Crée une liste Avec un Budget</Text>

                    <CheckBox
                        title='Toutes les opérations'
                        checked={selectorElements === 'All' ? true : false}
                        onPress={() => setSelectorElements('All')}


                    />
                    <CheckBox
                        title='Que les sorties'
                        checked={selectorElements === 'Expense' ? true : false}
                        onPress={() => setSelectorElements('Expense')}


                    />
                    <CheckBox
                        title='Que les entrées'
                        checked={selectorElements === 'Income' ? true : false}
                        onPress={() => setSelectorElements('Income')}

                    />

                    <Button
                        title="Créer la liste"
                        radius={25}
                        buttonStyle={{
                            backgroundColor: "#9C68DD",
                            width: "100%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                        }}
                        onPress={async () => {

                            const newLIst = await CreateListe({ budget, selectorElements: selectorElements });

                            console.log("NEW LIST", newLIst);

                            dispatch(addListArray(newLIst));


                            setIsVisible(!isVisible);
                        }}
                    />
                </View>
            </View>
        </Modal>
    )



}