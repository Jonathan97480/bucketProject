import { Icon } from "@rneui/base";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getColorBudget } from "../../utils/ColorCollection";
import { textSizeFixe } from "../../utils/TextManipulation";
import { ModalAddExpend } from "../../screen/AddOperationInTheBudget/components/ModalAddExpend/ModalAddOperation";


interface SectionTitleProps {
    title: string,
    remaining_budget: number,
    id_budget: number,
    budget_start: number,

    indexBudget: number
}


export const SectionTitle = ({ title, remaining_budget, budget_start, id_budget, indexBudget }: SectionTitleProps) => {

    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={
            [
                styles.centenaire,
                {
                    backgroundColor: getColorBudget(remaining_budget, budget_start)
                }
            ]
        }
        >
            <Text
                style={styles.title}
            >
                {remaining_budget}€
            </Text>
            <Text style={styles.title}>{textSizeFixe(title, 20)}</Text>
            <Icon
                name="plus"
                type="font-awesome"
                size={20}
                color="#000"
                onPress={() => {
                    setModalVisible(true);
                }}

                style={styles.icon}

            />
            <ModalAddExpend
                id_budget={id_budget}
                isVisible={modalVisible}
                setIsVisible={setModalVisible}
                indexBudget={indexBudget}
            />
        </View>
    );

}


const styles = StyleSheet.create({
    centenaire: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginBottom: 20,
        borderRadius: 20,

    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff"
    },
    icon: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 50,
        width: 40,
        height: 40,
        borderWidth: 1,
        overflow: 'hidden',
    }
});
