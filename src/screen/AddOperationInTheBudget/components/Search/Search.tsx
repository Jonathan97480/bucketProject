import React from "react";
import { View } from "react-native";
import { Icon, Input } from "@rneui/base";
import { SimpleTransactionInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { OperationArrayAlphabetizeOrder, rechercheExpendByName } from "./logic";
import { getTrad } from "../../../../lang/internationalization";


interface SearchProps {

    budget: TransactionMonthInterface;

    onSearch: (value: { income: SimpleTransactionInterface[], expense: SimpleTransactionInterface[] }) => void;

}


export const Search = ({ budget, onSearch }: SearchProps) => {

    return <View>
        <Input
            style={[
                globalStyle.colorTextPrimary,
            ]}
            placeholder={getTrad("ToResearch")}
            onChangeText={(text) => {
                if (text.length >= 3 && budget.transaction) {

                    const newOperations = rechercheExpendByName({
                        recherche: text,
                        income: budget.transaction?.income,
                        expense: budget.transaction?.expense,
                    })

                    onSearch({
                        income: newOperations.income,
                        expense: newOperations.expense
                    });

                } else if (text.length <= 0 && budget.transaction) {

                    onSearch({
                        income: OperationArrayAlphabetizeOrder([...budget.transaction.income]),
                        expense: OperationArrayAlphabetizeOrder([...budget.transaction.expense])
                    });

                }
            }}

            rightIcon={
                <Icon
                    name="search"
                    size={27}
                    color="#ffffff"

                />
            }

        />
    </View>



}