import { StyleSheet } from "react-native";
export const styleSheet = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100%",
        height: "100%",
        padding: 20,

    },
    formContainer: {
        backgroundColor: "#fff",
        width: "100%",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
    }
})