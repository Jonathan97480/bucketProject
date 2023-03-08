import { Icon } from "@rneui/base";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView, ScrollView } from "react-native";
import { getMonthByNumber } from "../../utils/DateManipulation";

export default function Compte() {

    const date = new Date();
    const Month = date.getMonth() + 1;
    const Year = date.getFullYear();

    return (
        <>
            <SafeAreaView>

                <View style={styles.container}>

                    <View style={styles.blockCurentMonth} >

                        <Text style={styles.blockCurentMonthText}>{getMonthByNumber(Month)} {Year}</Text>
                        <Text style={[styles.text, styles.textCenter]}>Compte Courant</Text>
                        <View style={styles.infoBlock}>
                            <View style={styles.graphe} ></View>
                            <View style={styles.infoBlockText} >
                                <Text style={styles.text} >Dépôt total </Text>
                                <Text>1200€</Text>
                            </View>

                            <View style={styles.separator} ></View>
                            <View style={styles.infoBlockText} >
                                <Text style={styles.text} >Retrait total</Text>
                                <Text>850€</Text>
                            </View>


                        </View>
                        <Text style={[styles.text, styles.textCenter]} >Soldes Restant 400€</Text>
                    </View>

                    <ScrollView style={styles.scrollview}>


                        {

                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => {
                                return (
                                    <View style={styles.blockMonthSelect} key={index} >

                                        <Text style={styles.blockCurentMonthText}>{getMonthByNumber(item)} {Year}</Text>

                                    </View>

                                )
                            })

                        }

                    </ScrollView>

                </View>

            </SafeAreaView>
        </>
    )

}




const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    blockCurentMonth: {
        padding: 16,
        backgroundColor: "#ffffff",


    },
    infoBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: "center",
        alignItems: 'center',
        marginBottom: 16,
    },
    scrollview: {
        padding: 16,
        paddingTop: 0,
        maxHeight: '73%',
    },
    infoBlockText: {
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    separator: {
        backgroundColor: "#000000",
        height: 32,
        width: 2
    },
    blockMonthSelect: {
        width: '100%',
        padding: 16,
        backgroundColor: "#ffffff",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 8,
        borderRadius: 10,
    },
    blockCurentMonthText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,

    },
    graphe: {
        width: 80,
        height: 80,
        backgroundColor: '#000000',
        borderRadius: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    textCenter: {
        textAlign: 'center',
    }
})