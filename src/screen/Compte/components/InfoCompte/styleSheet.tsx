import { StyleSheet } from "react-native";

export default StyleSheet.create({

    blockCurentMonth: {
        padding: 16,
        backgroundColor: "#D070E0",
        paddingTop: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 5,


    },
    infoBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: "center",
        alignItems: 'center',
        marginBottom: 16,
    },

    infoBlockText: {
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center',
        height: 64,
        paddingHorizontal: 16,

    },
    separator: {
        backgroundColor: "#ffffff",
        height: '100%',
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

});