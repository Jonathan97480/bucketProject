import { View, Text } from "react-native";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { MonthInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import styleSheet from "./styleSheet";

interface ArchiveItemProps {

    months: MonthInterface[] | null;
    year: number;
    trad: any;

}

export default function ArchiveItem({ months, year, trad }: ArchiveItemProps) {

    if (months === null) {
        months = []
    }

    return (
        <>
            {
                months.map((month: MonthInterface, index: number) => {
                    const numberTransaction = month.transactions.expense.length + month.transactions.income.length
                    return (<View style={[styleSheet.blockMonthSelect, globalStyle.backgroundSecondaryColor]}
                        key={'archive-' + index}
                    >

                        <Text style={[styleSheet.blockCurentMonthText, globalStyle.colorTextPrimary]}>{trad[month.nameMonth]} {year}</Text>
                        <Text style={[globalStyle.textSizeSmall, globalStyle.colorTextPrimary]} >{numberTransaction} {trad.transactions}</Text>
                    </View>
                    )
                })
            }


        </>
    )
}