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
    },
    icon: {
        width: width * 0.04,
        height: height * 0.04,

    },

});