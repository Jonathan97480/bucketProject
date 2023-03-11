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
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',

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