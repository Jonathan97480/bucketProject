import { StyleSheet, Dimensions } from "react-native";


const { width, height } = Dimensions.get("window");

export default StyleSheet.create({



    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 4,
        paddingVertical: 7,
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 30,
        marginHorizontal: 12,
        backgroundColor: '#312ECB',
        elevation: 10,
        width: width > 500 ? 500 : 320,
    },
    icon: {
        width: width > 500 ? 30 : 20,
        height: width > 500 ? 30 : 20,

    },

});