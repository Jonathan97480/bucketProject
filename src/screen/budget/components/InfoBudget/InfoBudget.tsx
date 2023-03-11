import { Button, Icon } from "@rneui/base";
import React from "react";
import { View, Text, Modal } from "react-native";
import { PoleExpend } from "../../../../redux/expendSlice";
import { useDispatch } from 'react-redux';
import styleSheet from "./styleSheet";

interface InfoModalProps {
    setIsViewModalInfo: (value: boolean) => void,
    editTransactionCallBack: () => void,
    IsViewModalInfo: boolean,
    budget: PoleExpend,
    indexBudget: number,
}


export const InfoModal = ({ setIsViewModalInfo, IsViewModalInfo, budget, indexBudget, editTransactionCallBack }: InfoModalProps) => {

    const dispatch = useDispatch();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={IsViewModalInfo}
            style={styleSheet.modal}
            onRequestClose={() => {
                setIsViewModalInfo(false);
            }}
        >
            <View style={styleSheet.contain}
            >

                <Text

                    style={styleSheet.budgetTitle}
                >{budget.nom}</Text>
                <View
                    style={styleSheet.containInfo}
                >
                    <Text
                        style={styleSheet.textInfo}
                    >MONTANT DEPART DU BUDGET</Text>
                    <Text
                        style={styleSheet.textInfo}
                    >{budget.montantStart}€</Text>

                    <Text
                        style={styleSheet.textInfo}
                    >MONTANT RESTANT DU BUDGET</Text>
                    <Text
                        style={styleSheet.textInfo}
                    >{budget.montant}€</Text>

                </View>



                <Button
                    disabled={budget.listeExpend.length <= 0}
                    containerStyle={{ width: "80%", marginBottom: 20, borderRadius: 10 }}
                    icon={
                        <Icon
                            containerStyle={{ marginRight: 10 }}
                            name="list"
                            size={20}
                            color="white"
                        />
                    }
                    title="Créer une liste"
                    onPress={() => {



                        setIsViewModalInfo(false);
                    }}
                />
                <Button
                    containerStyle={{ width: "80%", marginBottom: 20, borderRadius: 10 }}

                    icon={
                        <Icon
                            containerStyle={{ marginRight: 10 }}
                            name="edit"
                            size={20}
                            color="white"


                        />
                    }
                    title="Éditer le budget"
                    onPress={() => {
                        setIsViewModalInfo(false);
                        editTransactionCallBack();
                    }}
                />

            </View>
        </Modal >

    )


}


