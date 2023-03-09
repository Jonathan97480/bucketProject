import { StyleSheet } from "react-native";

export const styleSheet = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        height: 79,
        flexDirection: "row",
        alignItems: "center",
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
