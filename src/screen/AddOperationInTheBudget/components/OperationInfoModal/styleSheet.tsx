import { StyleSheet } from "react-native";

export default StyleSheet.create({


    container: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.2)",
        alignContent: "center",
        alignItems: "center",


    },
    backgroundRecipe: {
        height: "50%",
        backgroundColor: "white",
        paddingBottom: 20,
        width: "80%",
        justifyContent: "space-between",
        borderRadius: 25,
        elevation: 5,
    },
    titleTicket: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "capitalize",
        marginTop: 16,
    },
    textInfo: {
        marginBottom: 10,
    },
    viewTypeOperation: {
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
        height: 30,
        marginLeft: "25%",
    },
    viewRowCenter: {
        elevation: 2,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    iconDeleteStyle: {
        marginRight: 40,
        borderRadius: 50,
        backgroundColor: "red",
        padding: 8,
    },
    iconEditStyle: {

        elevation: 2,
        backgroundColor: "#203EAA",
        borderRadius: 50,
        padding: 8,


    },

});