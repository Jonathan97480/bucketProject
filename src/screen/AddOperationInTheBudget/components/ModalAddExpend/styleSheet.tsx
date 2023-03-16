import { StyleSheet } from "react-native";


export default StyleSheet.create({
    modal: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: "center",
    },
    View: {
        backgroundColor: "#fff",
        padding: 20,

        borderRadius: 20,
    },
    TitleBlock: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "50%",
        marginBottom: 40,
    },
    title: {
        fontSize: 19,
        fontWeight: "bold",
    },
    titleActive: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1D45D7",

        textDecorationLine: "underline",

    },
    Input: {},
    Button: {},
});