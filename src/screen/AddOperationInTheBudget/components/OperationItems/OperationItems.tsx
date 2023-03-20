import React, { useEffect } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
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
                    NewListeExpend.map((operation, index) => {
                        return (
                            <TouchableOpacity style={{ marginBottom: 20 }}
                                key={`${operation.id}-${index}-infoModal`}
                                onLongPress={() => {

                                    Alert.alert(
                                        "Supprimer",
                                        "Voulez-vous supprimer cette dépense ?",
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
                                }}
                                onPress={() => {
                                    infoPanelOpen(operation);
                                }}>
                                <View style={styleSheet.itemBudget}>
                                    <Text
                                        style={[{ width: "45%", }, globalStyle.colorTextPrimary]}

                                    >{textSizeFixe(operation.name, 17)}</Text>

                                    <Text style={[globalStyle.colorTextPrimary]} >{operation.total_real !== 0 ? operation.total_real.toFixed(2) : operation.total.toFixed(2)}€</Text>

                                    <View style={[{ backgroundColor: operation.type === "income" ? "#203EAA" : "#E1424B", }, styleSheet.pastille]}>
                                        <Text style={{ color: "#fff" }} >{operation.type === "income" ? "Depot" : "Retrait"}</Text>
                                    </View>


                                </View>
                            </TouchableOpacity>

                        )
                    })
                    : <Text style={{ textAlign: "center" }}>Vous n'avez pas encore d'éléments dans ce budget</Text>

            }

        </>
    )




}
