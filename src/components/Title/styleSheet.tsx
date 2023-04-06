
import { StyleSheet } from "react-native";
import { clampFontSizeWithScreenWidth } from "../../utils/TextManipulation";


export default StyleSheet.create({

    container: {
        width: "100%",
    },
    title: {
        fontSize: clampFontSizeWithScreenWidth(20, 10, 30),
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
    },
})
