

import { colorList } from "../../../../utils/ColorCollection";
import { Button, ListItem, Icon } from "@rneui/base";
import { setCurentBudget, setCurentCompte, setCurentMonth, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { IconsCategory } from "../../../../components";
import { deleteTransaction } from "./logic";
import { useSelector, useDispatch } from "react-redux";

interface BudgetSwipeableProps {
    transaction: TransactionMonthInterface;
    indexBudget: number;

    setModalEdit: (value: boolean, transaction: TransactionMonthInterface) => void;
    navigation: any;
}


export default function TransactionSwipeable({ transaction, indexBudget, setModalEdit, navigation }: BudgetSwipeableProps) {

    const curentCompte = useSelector((state: any) => state.compte.currentCompte);
    const curentMonth = useSelector((state: any) => state.compte.currentMonth);
    const dispatch = useDispatch();
    return (
        <ListItem.Swipeable

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
                    title={`Editer ${transaction.transactionType === "Spent" ? "Transaction" : "Budget"}`}
                    onPress={() => {

                        setModalEdit(true, transaction);
                        reset()
                    }}
                    icon={{ name: 'edit', color: 'white', }}
                    buttonStyle={{ minHeight: '100%' }}
                />
            )}
            rightContent={(reset) => (
                <Button
                    containerStyle={{ borderRadius: 20, }}
                    title={`Supprimer ${transaction.transactionType === "Spent" ? "Transaction" : "Budget"}`}
                    onPress={() => {

                        deleteTransaction({
                            _transaction: transaction,
                            _compte: curentCompte,
                            _curentMonth: curentMonth,
                        }).then((res) => {

                            dispatch(setCurentCompte(res.compte));
                            dispatch(setCurentMonth(res.curentMonth));



                            reset()
                        })

                        reset()

                    }
                    }
                    icon={{ name: 'delete', color: 'white' }}
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
                >{transaction.name}</ListItem.Title>
                {
                    transaction.transactionType === "Budget" ?
                        <>
                            <ListItem.Subtitle
                                style={{ color: colorList.primary, fontSize: 12 }}
                            >Montant de départ : {transaction.start_montant}€</ListItem.Subtitle>
                            <ListItem.Subtitle
                                style={{ color: colorList.primary, fontSize: 12 }}
                            >Budget restant : {transaction.montant}€</ListItem.Subtitle>
                        </>
                        :
                        <>

                            <ListItem.Subtitle
                                style={{ color: colorList.primary, fontSize: 12 }}
                            >Montant : {transaction.montant}€</ListItem.Subtitle>
                        </>
                }
            </ListItem.Content>
            <IconsCategory id_category={transaction.categoryID} />
        </ListItem.Swipeable>
    )

}