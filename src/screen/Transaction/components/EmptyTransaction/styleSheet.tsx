import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({



    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        width: "100%",

    }, image: {
        width: width > 500 ? 300 : 200,
        height: width > 500 ? 300 : 200,

    }


})