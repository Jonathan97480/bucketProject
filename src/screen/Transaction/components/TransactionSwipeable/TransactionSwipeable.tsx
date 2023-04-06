

import { colorList } from "../../../../utils/ColorCollection";
import { Button, ListItem, Icon } from "@rneui/base";
import { addComptes, setCurentBudget, setCurentCompte, setCurentMonth, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { IconsCategory } from "../../../../components";
import { deleteTransaction } from "./logic";
import { useSelector, useDispatch } from "react-redux";
import { View, Dimensions, Alert } from "react-native";
import { getTrad } from "../../../../lang/internationalization";

interface BudgetSwipeableProps {
    transaction: TransactionMonthInterface;
    indexBudget: number;
    setModalEdit: (value: boolean, transaction: TransactionMonthInterface) => void;
    navigation: any;
}


export default function TransactionSwipeable({ transaction, indexBudget, setModalEdit, navigation }: BudgetSwipeableProps) {

    const curentCompte = useSelector((state: any) => state.compte.currentCompte);
    const curentMonth = useSelector((state: any) => state.compte.currentMonth);
    const comptes = useSelector((state: any) => state.compte.comptes);
    const dispatch = useDispatch();
    const { width, height } = Dimensions.get('window');

    return (
        <ListItem.Swipeable
            style={
                {
                    borderRadius: 20,
                    overflow: 'hidden',
                    width: width > 500 ? 500 : width * 0.8,
                    maxWidth: width > 500 ? 500 : "100%",

                }
            }



            containerStyle={[{ backgroundColor: transaction.transactionType === "Spent" ? "#9C68DD" : "#4F94BB", borderRadius: 20 }]}
            onPress={() => {
                if (transaction.transactionType === "Budget") {

                    dispatch(setCurentBudget(transaction));
                    navigation.navigate('AddExpendBudget');
                }

            }}


            leftContent={(reset) => (
                <Button
                    containerStyle={globalStyle.btnContainerStyle}
                    buttonStyle={{ minHeight: '100%' }}
                    titleStyle={globalStyle.btnTitleStyle}
                    radius={25}
                    title={getTrad("Edit") + ` ${transaction.transactionType === "Spent" ? getTrad("Transaction") : getTrad("Budget")} `}
                    onPress={() => {

                        setModalEdit(true, transaction);
                        reset()
                    }}


                />
            )}
            rightContent={(reset) => (
                <Button
                    containerStyle={globalStyle.btnContainerStyle}
                    buttonStyle={[{ minHeight: '100%', backgroundColor: 'red' }]}
                    titleStyle={globalStyle.btnTitleStyle}
                    radius={25}
                    title={getTrad("delete") + ` ${transaction.transactionType === "Spent" ? "Transaction" : "Budget"} `}
                    onPress={() => {

                        if (transaction.transactionType === "Budget") {
                            Alert.alert(
                                getTrad("DeleteBudget"),
                                getTrad("DeleteBudgetMessage"),
                                [
                                    {
                                        text: getTrad("cancel"),
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                    {
                                        text: getTrad("Delete"),
                                        onPress: () => {
                                            deleteBudget()
                                            reset()
                                        }
                                    }
                                ],)
                        } else {
                            deleteBudget()
                            reset()
                        }
                    }
                    }



                />
            )}
        >
            <Icon
                name={transaction.transactionType === "Spent" ? "swap-horizontal-bold" : "wallet"}
                type='material-community'
                color={colorList.primary}
                size={width * 0.08}
            />
            <ListItem.Content
                style={{

                    width: width > 500 ? 700 : 400,
                    maxWidth: width > 500 ? 500 : 400,
                }}
            >
                <ListItem.Title
                    style={[
                        { fontSize: width > 500 ? 30 : width * 0.05, color: "#fff" },
                        globalStyle.textBold,
                        globalStyle.textAlignLeft

                    ]}
                >{transaction.name.slice(0, 30)}</ListItem.Title>
                {
                    transaction.transactionType === "Budget" ?
                        <>
                            <ListItem.Subtitle
                                style={{ color: colorList.primary, fontSize: width > 500 ? 20 : width * 0.03, width: "100%" }}
                            >{getTrad("AmountStart")} : {transaction.start_montant.toFixed(2)}€</ListItem.Subtitle>

                            <ListItem.Subtitle
                                style={{ color: colorList.primary, fontSize: width > 500 ? 20 : width * 0.03, width: "100%" }}
                            >{getTrad("RemainingBudget")} : {transaction.montant.toFixed(2)}€</ListItem.Subtitle>
                        </>
                        :
                        <>

                            <ListItem.Subtitle
                                style={{ color: colorList.primary, fontSize: width > 500 ? 20 : width * 0.03, width: "100%" }}
                            >{getTrad("Amount")} : {transaction.montant_real === 0 ? transaction.montant.toFixed(2) : transaction.montant_real.toFixed(2)}€</ListItem.Subtitle>
                        </>
                }
            </ListItem.Content>
            <View

                style={{
                    flexDirection: "row",
                    alignItems: "center",


                }}
            >
                <IconsCategory id_category={transaction.categoryID} />
                {
                    transaction.isClosed &&
                    <Icon

                        name="lock"
                        type='material-community'
                        color={colorList.primary}
                        size={width * 0.08}
                    />}
            </View>
        </ListItem.Swipeable>
    )

    function deleteBudget() {
        deleteTransaction({
            _transaction: transaction,
            _compte: curentCompte,
            _curentMonth: curentMonth,
            _AllComptes: comptes
        }).then((res) => {

            dispatch(setCurentCompte(res.compte));
            dispatch(setCurentMonth(res.curentMonth));
            if (res.allComptes.length > 0) {
                dispatch(addComptes(res.allComptes));
            }

        })

    }

}