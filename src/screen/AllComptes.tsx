import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button } from "@rneui/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import DatabaseManager from "../utils/DataBase";
import { addComptes, CompteInterface } from "../redux/comptesSlice";
import { ComptesItem } from "../components/ComptesItem/ComptesItem";
import { ModalAddCompte } from "../components/ModalAddCompte/ModalAddCompte";



export default function AllComptes() {
    const [isCompteModalVisible, setIsCompteModalVisible] = React.useState(false);

    const comptes: CompteInterface[] = useSelector((state: any) => state.compte.comptes);
    const dispatch = useDispatch();
    useEffect(() => {

        if (comptes.length <= 0) {
            DatabaseManager.getAllCompte().then((comptes) => {
                if (comptes.length > 0) {
                    dispatch(addComptes(comptes))
                }
            });
        }


    }, [comptes]);


    return (
        <SafeAreaView>
            <View style={styles.container}>
                <ScrollView>
                    {
                        comptes.map((compte, index) => {
                            return (
                                <ComptesItem
                                    key={index + "-compte"}
                                    item={{
                                        name: compte.name,
                                        montant: compte.montant,
                                        id: compte.id,
                                        date: compte.date,
                                        index: index
                                    }}
                                />
                            )
                        })
                    }
                </ScrollView>
                <Button
                    title="Ajouter un compte"
                    onPress={onPress}

                />
            </View>
            <ModalAddCompte
                visible={isCompteModalVisible}
                setVisible={setIsCompteModalVisible}
            />
        </SafeAreaView>
    );
    function onPress() {
        setIsCompteModalVisible(true);
    }
}







const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100%",
        height: "100%",
        paddingBottom: 20,
    },
    text: {
        fontSize: 30,
    },
});