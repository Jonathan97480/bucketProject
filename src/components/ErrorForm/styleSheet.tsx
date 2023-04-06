import { StyleSheet, Dimensions } from "react-native";
import { clampFontSizeWithScreenWidth } from "../../utils/TextManipulation";



const { width, height } = Dimensions.get('window');


export default StyleSheet.create({

    success: {
        backgroundColor: "#28a745",
    },
    error: {
        backgroundColor: "#dc3545",
    },

    container: {
        height: width > 500 ? 75 : 65,
        width: "100%",
        maxWidth: 400,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        padding: 10,


    },
    text: {
        color: "#fff",
        fontSize: clampFontSizeWithScreenWidth(16, 12, 20),
        fontWeight: "600"

    }

});