
import { Icon } from '@rneui/base';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { PoleExpend } from "../../redux/expendSlice";
import { colorList } from '../../utils/ColorCollection';
import DatabaseManager from "../../utils/DataBase";
import { ModalInfoCompte } from '../ModalInfoCompte/ModalInfoCompte';



interface ComptesItemProps {
    item: any;
    navigation?: any;
}

export const ComptesItem = ({ item, navigation = undefined }: ComptesItemProps) => {

    const budget: PoleExpend[] = useSelector((state: any) => state.expend.expends);
    const [budgets, setBudgets] = React.useState<PoleExpend[]>([]);
    const [rest, setRest] = React.useState(0);
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    useEffect(() => {
        DatabaseManager.getBudgetByCompteId(item.id).then((budgets) => {

            setBudgets(budgets);
            setRest(CalculCompteRest(budgets, item.montant));
        });



    }, [budget]);



    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => {
                    if (navigation !== undefined) {
                        navigation.navigate("Tab");
                    }
                }}
                onLongPress={onLongPress}
            >
                <View style={styles.headerCard}>

                    <Icon
                        name="account-balance-wallet"
                        size={30}
                        color="#900"

                    />

                    <Text style={styles.title}>{item.name}</Text>

                    <Text
                        style={[
                            styles.title,
                            { color: rest < 0 ? colorList.bad : colorList.good }
                        ]}
                    >
                        {rest}€
                    </Text>
                </View>

                <Text style={styles.smallText}>nombres de budget liée : {budgets.length}</Text>
                <Text style={styles.smallText}>montant de départ : {item.montant}€</Text>

            </TouchableOpacity>

            <ModalInfoCompte
                isViewModalInfoCompte={isModalVisible}
                setIsViewModalInfoCompte={setIsModalVisible}
                compte={item}
                budgets={budgets}
                index={item.index}
            />
        </>
    )



    function onLongPress() {

        setIsModalVisible(true);
    }

    function CalculCompteRest(budgets: PoleExpend[], montant: number): number {

        let montantRest = montant;
        budgets.forEach((budget) => {
            montantRest -= budget.montantStart;
        });
        return montantRest;

    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        padding: 10,
        margin: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    icon: {

    },
    headerCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
        textTransform: "capitalize",
        textAlign: "left"

    },
    smallText: {
        fontSize: 13,
        fontWeight: "300",
        color: "#000"
    }
});
