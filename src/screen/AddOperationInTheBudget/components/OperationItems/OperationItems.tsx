import React, { useEffect } from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import styleSheet from './styleSheet'
import { SimpleTransactionInterface } from '../../../../redux/comptesSlice'
import globalStyle from '../../../../assets/styleSheet/globalStyle'
import { textSizeFixe } from '../../../../utils/TextManipulation'



interface OperationItemsProps {
    listeExpend: SimpleTransactionInterface[],

    deleteCallBack: (operation: SimpleTransactionInterface) => void
    infoPanelOpen: (operation: SimpleTransactionInterface) => void


}


export default function OperationItems({ listeExpend, deleteCallBack, infoPanelOpen }: OperationItemsProps) {

    const [NewListeExpend, setNewListeExpend] = React.useState<SimpleTransactionInterface[]>(listeExpend);

    useEffect(() => {

        setNewListeExpend(listeExpend);


    }, [listeExpend,]);

    return (
        <>

            {
                NewListeExpend.length > 0 ?
                    <FlatList

                        data={NewListeExpend}
                        renderItem={({ item, index }) => <ItemList operation={item} index={index} deleteCallBack={deleteCallBack} infoPanelOpen={infoPanelOpen} />}
                        keyExtractor={(item, index) => index.toString() + item.id.toString() + -"operation"}

                    />
                    : <EmptyList />

            }

        </>
    )




}

const EmptyList = React.memo(() => {
    return (
        <Text style={[
            globalStyle.colorTextPrimary,
            globalStyle.textAlignCenter,
            globalStyle.textSizeSmall
        ]}>Vous n'avez pas encore d'opération pour cette section</Text>
    )


})

const ItemList = React.memo(({ operation, index, deleteCallBack, infoPanelOpen }: {
    operation: SimpleTransactionInterface
    index: number
    deleteCallBack: (operation: SimpleTransactionInterface) => void
    infoPanelOpen: (operation: SimpleTransactionInterface) => void
}) => {

    const operationMemo = React.useMemo(() => {

        return operation;

    }, [operation]);

    const handleLongPress = () => {
        Alert.alert(
            "Supprimer",
            "Voulez-vous supprimer cette opération ?",
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        deleteCallBack(operation);
                    }
                }
            ],
            { cancelable: false }
        );

    }


    return (
        <TouchableOpacity style={{ marginBottom: 20 }}

            onLongPress={() => handleLongPress}
            onPress={() => infoPanelOpen(operation)}>

            <View style={styleSheet.itemBudget}>
                <Text
                    style={[{ width: "45%", }, globalStyle.colorTextPrimary]}

                >{textSizeFixe(operationMemo.name, 17)}</Text>

                <Text style={[globalStyle.colorTextPrimary]} >{operationMemo.total_real !== 0 ? operationMemo.total_real.toFixed(2) : operationMemo.total.toFixed(2)}€</Text>

                <View style={[{ backgroundColor: operationMemo.type === "income" ? "#203EAA" : "#E1424B", }, styleSheet.pastille]}>
                    <Text style={{ color: "#fff" }} >{operationMemo.type === "income" ? "Depot" : "Retrait"}</Text>
                </View>


            </View>
        </TouchableOpacity>

    )




})