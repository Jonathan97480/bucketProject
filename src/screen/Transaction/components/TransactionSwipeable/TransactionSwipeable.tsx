import { useDispatch } from "react-redux";
import { PoleExpend } from "../../../../redux/expendSlice";
import { colorList, getColorBudget } from "../../../../utils/ColorCollection";
import { Button, ListItem, Icon } from "@rneui/base";
import { View, Text, ScrollView, StatusBar, SafeAreaView } from "react-native";
import { curentBudgetInterface } from "../../Transaction";
import { TransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";

interface BudgetSwipeableProps {
    transaction: TransactionMonthInterface;
    indexBudget: number;
    setCurentBudget: (value: curentBudgetInterface) => void;
    setIsViewModalInfo: (value: boolean) => void;
    navigation: any;
}


export default function TransactionSwipeable({ transaction, indexBudget, setCurentBudget, setIsViewModalInfo, navigation }: BudgetSwipeableProps) {

    const dispatch = useDispatch();

    return (
        <ListItem.Swipeable

            containerStyle={[{ backgroundColor: getColorBudget(transaction.montant, transaction.start_montant), borderRadius: 20, }]}
            onPress={() => {
                navigation.navigate('AddExpendBudget', { curentBudget: transaction, indexBudget: indexBudget });
            }}


            leftContent={(reset) => (
                <Button
                    containerStyle={{ borderRadius: 20, }}
                    title="Info"
                    onPress={() => {
                        /*   setCurentBudget({ budget: transaction, indexBudget });
                          setIsViewModalInfo(true);
                          reset() */
                    }}
                    icon={{ name: 'info', color: 'white' }}
                    buttonStyle={{ minHeight: '100%' }}
                />
            )}
            rightContent={(reset) => (
                <Button
                    containerStyle={{ borderRadius: 20, }}
                    title="Delete"
                    onPress={() => {
                        reset()

                    }
                    }
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
            )}
        >
            <Icon
                name="dollar"
                type='font-awesome'
                color={colorList.primary}
            />
            <ListItem.Content

            >
                <ListItem.Title
                    style={{ color: colorList.primary, fontWeight: 'bold' }}
                >{transaction.name}</ListItem.Title>
                <ListItem.Subtitle
                    style={{ color: colorList.primary, fontSize: 12 }}
                >Montant de départ : {transaction.start_montant}€</ListItem.Subtitle>
                <ListItem.Subtitle
                    style={{ color: colorList.primary, fontSize: 12 }}
                >Budget restant : {transaction.montant}€</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem.Swipeable>
    )

}