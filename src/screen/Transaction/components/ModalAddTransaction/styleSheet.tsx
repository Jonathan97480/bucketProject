import { StyleSheet } from "react-native";
import { colorList } from "../../../../utils/ColorCollection";


export default StyleSheet.create({

    modal: {
        elevation: 5,

    },
    titleModal: {

        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
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

    },
    stageContainer: {
        minHeight: 180,
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    modalInputLabel: {
        fontSize: 15,
        fontWeight: 'bold',

    },
    modalFooter: {},
    color_primary_text: {
        color: colorList.primary,
        textTransform: 'capitalize',
    }


})