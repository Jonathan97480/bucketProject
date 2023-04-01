import { StyleSheet, Dimensions } from "react-native";


const { width, height } = Dimensions.get('window');
export default StyleSheet.create({

    backgroundPrimaryColor: {
        backgroundColor: "#282525",
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
    textSizeSmall: {
        fontSize: 12,
        fontWeight: "600"
    },
    textSizeMedium: {
        fontSize: 16,
        fontWeight: "600"
    },
    textSizeLarge: {
        fontSize: 20,
        fontWeight: "600"
    },
    textSizeXLarge: {
        fontSize: 24,
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


    },
    marginVertical: {
        marginVertical: 16,
    },
    inputStyle: {
        color: "#FFF",
    },

    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    btnStyle: {

        backgroundColor: "#17a2b8",
        height: height * 0.06,
        width: "100%",


    },
    textBold: {
        fontWeight: "bold",
    },
    containerCheckBox: {
        flexDirection: 'row',
    },
    checkBox: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
        marginTop: 8,
    },
    checkBoxText: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: '#fff',
    },
    checkBoxDisabled: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
        marginTop: 8,
    },

});