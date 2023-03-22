import { StyleSheet } from "react-native";




export default StyleSheet.create({
    centenaire: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingVertical: 15,
        backgroundColor: "#fff",
        marginBottom: 20,
        borderRadius: 20,

    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff"
    },

    scrollView: {

        justifyContent: 'flex-start',
        alignItems: "center",
        minHeight: "100%",
        maxWidth: "100%",
        paddingTop: 20,

    },
    container2: {

        justifyContent: "center",
        alignItems: "center"
    }, title2: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
        lineHeight: 30,

    },
    containerIcon: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: 70,
    }

});
