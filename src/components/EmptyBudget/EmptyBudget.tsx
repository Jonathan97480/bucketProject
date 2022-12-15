import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image, Button } from "@rneui/base";
import { IconBudgetAdd } from "../../utils/IconCustom";


interface EmptyBudgetProps {
    setIsViewModalAddBudget: (value: boolean) => void
}

export const EmptyBudget = ({ setIsViewModalAddBudget }: EmptyBudgetProps) => {

    return (
        <View style={styles.container}>

            <Image
                source={IconBudgetAdd}
                style={styles.image}
            />
            <Text style={styles.title}>Vous n'avez pas encore de budget</Text>
            <Button

                buttonStyle={styles.button}
                title="Ajouter un budget" onPress={() => {
                    setIsViewModalAddBudget(true);
                }} />

        </View>
    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        width: "100%",

    }, image: {
        width: 200,
        height: 200

    }, title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    button: {
        borderRadius: 10
    }


})