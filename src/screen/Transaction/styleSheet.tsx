import { StyleSheet } from "react-native";


export default StyleSheet.create({
    safeAreaView: {
        maxHeight: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        maxHeight: '100%',
        justifyContent: 'center',
        height: '100%',
    },

    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        minHeight: '100%',
        width: '100%',
        padding: 10,
    },
    scrollViewContainer: {
        width: '100%',
        height: '100%',
        marginTop: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonAddBudget: {

        flex: 1,
        borderRadius: 50,
        backgroundColor: '#596cab',

    }



});
