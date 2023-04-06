import { StyleSheet, Dimensions } from "react-native";
import { clampFontSizeWithScreenWidth } from "../../utils/TextManipulation";


const { width, height } = Dimensions.get('window');
export default StyleSheet.create({

    backgroundPrimaryColor: {
        backgroundColor: "#282525",
    },
    labelStyle: {
        color: "#fff",
        fontSize: clampFontSizeWithScreenWidth(16, 12, 20),
        marginBottom: 5,
    },

    backgroundSecondaryColor: {
        backgroundColor: "#817FE5",
    },
    backgroundTrinaryColor: {
        backgroundColor: "#6A6464",
    },
    backgroundSuccessColor: {
        backgroundColor: "#00FF00",
    },

    colorTextPrimary: {
        color: "#fff",

    },
    titleStyle: {
        color: "#fff",
        fontSize: clampFontSizeWithScreenWidth(20, 14, 24),
        fontWeight: "bold",

    },
    textSizeSmall: {
        fontSize: clampFontSizeWithScreenWidth(12, 10, 14),
        fontWeight: "600"
    },
    textSizeMedium: {
        fontSize: clampFontSizeWithScreenWidth(16, 12, 20),
        fontWeight: "600"
    },
    textSizeLarge: {
        fontSize: clampFontSizeWithScreenWidth(20, 14, 24),
        fontWeight: "600"
    },
    textSizeXLarge: {
        fontSize: clampFontSizeWithScreenWidth(24, 16, 28),
        fontWeight: "600"
    },
    textAlignCenter: {
        textAlign: "center",
    },
    textAlignLeft: {
        textAlign: "left",
    },
    textAlignRight: {
        textAlign: "right",
    },
    backgroundErrorColor: {
        backgroundColor: "#FF0000",
    },
    containerCenter: {
        justifyContent: "center",
        flex: 1,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    marginVertical: {
        marginVertical: 16,
    },
    inputStyle: {
        color: "#FFF",
        fontSize: clampFontSizeWithScreenWidth(16, 12, 20),
        fontWeight: "bold",
        backgroundColor: "#6A6464",
        borderRadius: 10,
        height: clampFontSizeWithScreenWidth(40, 30, 50),
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 0,


    },
    inputContainerStyle: {
        borderBottomWidth: 0,
        marginBottom: 0,


    },

    containerForm: {
        width: "100%",
        maxWidth: width > 500 ? 500 : 400,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 10,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
    },


    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    btnStyle: {

        backgroundColor: "#007bff",
        width: "100%",
        maxWidth: width > 500 ? 400 : 300,
        height: width > 500 ? 60 : 45,


    },
    btnContainerStyle: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    btnTitleStyle: {
        fontSize: clampFontSizeWithScreenWidth(18, 15, 25),
        fontWeight: "bold",
        marginVertical: 0,
        paddingVertical: 0,
        marginHorizontal: 0,
        paddingHorizontal: 0,
        alignItems: "center",

    },
    textBold: {
        fontWeight: "bold",
    },

    containerCheckBoxStyle: {
        backgroundColor: "#6A6464",
        borderWidth: 0,
        borderRadius: 10,
        width: "100%",
        maxWidth: width > 500 ? 440 : 295,
        height: width > 500 ? 60 : 45,
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 20,

    },
    checkedColorCheckBox: {
        color: "#ffc107",
    },
    titleStyleCheckBox: {
        color: "#fff",
        fontSize: clampFontSizeWithScreenWidth(16, 12, 20),
    }, checkBoxStyle: {
        margin: 0,
        padding: 0,
    },
    modalContainerStyleForm: {
        width: "95%",
        backgroundColor: "#282525",
        maxWidth: width > 500 ? 500 : 400,
        borderRadius: 10,


    },
    btnDisabledStyle: {
        backgroundColor: "#6A6464",
        width: "100%",
        maxWidth: width > 500 ? 400 : 300,
        height: width > 500 ? 60 : 45,

    }, pickerInputStyle: {
        color: "#FFF",
        fontSize: clampFontSizeWithScreenWidth(16, 12, 20),
        fontWeight: "bold",
        backgroundColor: "#6A6464",

    }

});