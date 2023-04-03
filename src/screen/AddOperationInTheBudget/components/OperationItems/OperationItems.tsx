import React, { useEffect } from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import styleSheet from './styleSheet'
import { SimpleTransactionInterface } from '../../../../redux/comptesSlice'
import globalStyle from '../../../../assets/styleSheet/globalStyle'
import { getTrad } from '../../../../lang/internationalization'




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
                        renderItem={({ item, index }) => <ItemList
                            operation={item}
                            index={index}
                            deleteCallBack={deleteCallBack}
                            infoPanelOpen={infoPanelOpen}

                        />

                        }
                        keyExtractor={(item, index) => index.toString() + item.id.toString() + -"operation"}

                    />
                    : <EmptyList />

            }

        </>
    )




}

const EmptyList = React.memo((props: any) => {
    return (
        <Text style={[
            globalStyle.colorTextPrimary,
            globalStyle.textAlignCenter,
            globalStyle.textSizeSmall
        ]}>{getTrad("YouDontHaveOperationsThisSection")}</Text>
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
            getTrad("delete"),
            getTrad("DoYouWantDeleteOperation"),
            [
                {
                    text: getTrad("cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: getTrad("yes"),
                    onPress: () => {
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

                >{operationMemo.name.substring(0, 18)}</Text>

                <Text style={[globalStyle.colorTextPrimary]} >{operationMemo.total_real !== 0 ? operationMemo.total_real.toFixed(2) : operationMemo.total.toFixed(2)}€</Text>

                <View style={[{ backgroundColor: operationMemo.type === "income" ? "#203EAA" : "#E1424B", }, styleSheet.pastille]}>
                    <Text style={{ color: "#fff" }} >{operationMemo.type === "income" ? getTrad("Deposit") : getTrad("Withdrawal")}</Text>
                </View>


            </View>
        </TouchableOpacity>

    )




})