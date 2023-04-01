import { StyleSheet, Dimensions } from "react-native";
import { colorList } from "../../../../utils/ColorCollection";

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({

    modal: {
        elevation: 5,

    },

    modalContainer: {

        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalHeader: {},
    modalBody: {

        width: '100%',
        minHeight: 340,
        alignItems: 'center',

    },
    stageContainer: {
        minHeight: 180,
        justifyContent: 'space-between',
        paddingVertical: 10,
        width: '100%',
    },
    modalInputLabel: {
        fontSize: width * 0.04,
        fontWeight: 'bold',

    },
    modalFooter: {},
    color_primary_text: {
        color: colorList.primary,
        textTransform: 'capitalize',
    }


})