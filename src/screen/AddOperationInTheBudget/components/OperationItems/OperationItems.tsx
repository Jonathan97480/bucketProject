import React, { useEffect, useState, useCallback } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import styleSheet from './styleSheet'
import { setCurentBudget, setCurentCompte, setCurentMonth, SimpleTransactionInterface, TransactionMonthInterface } from '../../../../redux/comptesSlice'
import globalStyle from '../../../../assets/styleSheet/globalStyle'
import { textSizeFixe } from '../../../../utils/TextManipulation'
import { OperationInfoModal } from '../OperationInfoModal/OperationInfoModal'
import { deleteOperation } from './logic'


interface OperationItemsProps {
    listeExpend: SimpleTransactionInterface[],


    idBudget: number

}


export default function OperationItems({ listeExpend, idBudget }: OperationItemsProps) {

    const [NewListeExpend, setNewListeExpend] = React.useState<SimpleTransactionInterface[]>(listeExpend);

    const budget: TransactionMonthInterface = useSelector((state: any) => state.compte.curentBudget);


    const CurentCompte = useSelector((state: any) => state.compte.currentCompte);
    const CurentMonth = useSelector((state: any) => state.compte.currentMonth);

    useEffect(() => {

        setNewListeExpend(listeExpend);

    }, [listeExpend]);


    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();


    const deleteOperationCallBack = useCallback(async (operation: SimpleTransactionInterface) => {

        deleteOperation({
            compte: CurentCompte,
            month: CurentMonth,
            budget: budget,
            operation: operation,
        }).then((res) => {

            dispatch(setCurentBudget(res.budget));
            dispatch(setCurentCompte(res.compte));
            dispatch(setCurentMonth(res.month));
            setModalVisible(false);

        }).catch((err) => {
            console.error("ERROR DELETED OPERATION", err);
        });

    }, []);


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
                                                    deleteOperationCallBack(operation);
                                                }
                                            }
                                        ],
                                        { cancelable: false }
                                    );
                                }}
                                onPress={() => {
                                    setModalVisible(true);
                                }}>
                                <View style={styleSheet.itemBudget}>
                                    <Text
                                        style={[{ width: "45%", }, globalStyle.colorTextPrimary]}

                                    >{textSizeFixe(operation.name, 17)}</Text>
                                    <Text style={[globalStyle.colorTextPrimary]} >{operation.total_real !== 0 ? operation.total_real : operation.total}€</Text>
                                    <View style={[{ backgroundColor: operation.type === "income" ? "#203EAA" : "#E1424B", }, styleSheet.pastille]}>
                                        <Text style={{ color: "#fff" }} >{operation.type === "income" ? "Depot" : "Retrait"}</Text>
                                    </View>

                                    <OperationInfoModal
                                        isModalVisible={modalVisible}
                                        setIsModalVisible={setModalVisible}
                                        operation={operation}
                                        budget={budget}
                                        callbackDeleteBtn={() => {
                                            deleteOperationCallBack(operation);

                                        }}


                                    />
                                </View>
                            </TouchableOpacity>

                        )
                    })
                    : <Text style={{ textAlign: "center" }}>Vous n'avez pas encore d'éléments dans ce budget</Text>

            }

        </>
    )




}
