

import { colorList } from "../../../../utils/ColorCollection";
import { Button, ListItem, Icon } from "@rneui/base";
import { addComptes, setCurentBudget, setCurentCompte, setCurentMonth, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { IconsCategory } from "../../../../components";
import { deleteTransaction } from "./logic";
import { useSelector, useDispatch } from "react-redux";
import { View } from "react-native";

interface BudgetSwipeableProps {
    transaction: TransactionMonthInterface;
    indexBudget: number;
    trad: any;
    setModalEdit: (value: boolean, transaction: TransactionMonthInterface) => void;
    navigation: any;
}


export default function TransactionSwipeable({ transaction, indexBudget, setModalEdit, navigation, trad }: BudgetSwipeableProps) {

    const curentCompte = useSelector((state: any) => state.compte.currentCompte);
    const curentMonth = useSelector((state: any) => state.compte.currentMonth);
    const comptes = useSelector((state: any) => state.compte.comptes);
    const dispatch = useDispatch();

    return (
        <ListItem.Swipeable
            style={
                {
                    minWidth: 310,
                    maxWidth: 400,
                }
            }
            containerStyle={[{ backgroundColor: transaction.transactionType === "Spent" ? "#9C68DD" : "#4F94BB", borderRadius: 20, }]}
            onPress={() => {
                if (transaction.transactionType === "Budget") {

                    dispatch(setCurentBudget(transaction));
                    navigation.navigate('AddExpendBudget');
                }

            }}


            leftContent={(reset) => (
                <Button
                    containerStyle={{ borderRadius: 20, }}
                    title={trad.Edit + ` ${transaction.transactionType === "Spent" ? trad.Transaction : trad.Budget} `}
                    onPress={() => {

                        setModalEdit(true, transaction);
                        reset()
                    }}

                    buttonStyle={{ minHeight: '100%' }}
                />
            )}
            rightContent={(reset) => (
                <Button
                    containerStyle={{ borderRadius: 20, }}
                    title={trad.delete + ` ${transaction.transactionType === "Spent" ? "Transaction" : "Budget"} `}
                    onPress={() => {

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
                            reset()
                        })
                        reset()

                    }
                    }

                    buttonStyle={[{ minHeight: '100%', backgroundColor: 'red' }]}
                    color="#ffffff"
                />
            )}
        >
            <Icon
                name={transaction.transactionType === "Spent" ? "swap-horizontal-bold" : "wallet"}
                type='material-community'
                color={colorList.primary}
            />
            <ListItem.Content

            >
                <ListItem.Title
                    style={{ color: colorList.primary, fontWeight: 'bold' }}
                >{transaction.name.slice(0, 30)}</ListItem.Title>
                {
                    transaction.transactionType === "Budget" ?
                        <>
                            <ListItem.Subtitle
                                style={{ color: colorList.primary, fontSize: 12 }}
                            >{trad.AmountStart} : {transaction.start_montant.toFixed(2)}€</ListItem.Subtitle>

                            <ListItem.Subtitle
                                style={{ color: colorList.primary, fontSize: 12 }}
                            >{trad.RemainingBudget} : {transaction.montant.toFixed(2)}€</ListItem.Subtitle>
                        </>
                        :
                        <>

                            <ListItem.Subtitle
                                style={{ color: colorList.primary, fontSize: 12 }}
                            >{trad.Amount} : {transaction.montant_real === 0 ? transaction.montant.toFixed(2) : transaction.montant_real.toFixed(2)}€</ListItem.Subtitle>
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
                    />}
            </View>
        </ListItem.Swipeable>
    )

}