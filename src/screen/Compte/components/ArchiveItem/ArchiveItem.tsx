import { View, Text, Dimensions } from "react-native";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { MonthInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import styleSheet from "./styleSheet";
import { getTrad } from "../../../../lang/internationalization";
interface ArchiveItemProps {

    months: MonthInterface[] | null;
    year: number;


}



export default function ArchiveItem({ months, year }: ArchiveItemProps) {

    const { width } = Dimensions.get('window');

    if (months === null) {
        return <>
            <View style={[styleSheet.blockMonthSelect, globalStyle.backgroundSecondaryColor]}>
                <Text style={[styleSheet.blockCurentMonthText, globalStyle.colorTextPrimary]}>{getTrad("NoMonthData")}</Text>
            </View>
        </>
    }



    return (
        <>
            {
                months.slice(0).reverse().map((month: MonthInterface, index: number) => {

                    const numberTransaction = month.transactions.expense.length + month.transactions.income.length
                    return (<View style={[styleSheet.blockMonthSelect, globalStyle.backgroundSecondaryColor]}
                        key={'archive-' + index}
                    >

                        <Text style={[styleSheet.blockCurentMonthText, globalStyle.colorTextPrimary, { fontSize: width * 0.04 }]}>{getTradNameMonth(month.nameMonth)} {year}</Text>
                        <Text style={[{ fontSize: width * 0.031 }, globalStyle.colorTextPrimary]} >{numberTransaction} {getTrad("transactions")}</Text>
                    </View>
                    )
                })
            }


        </>
    )
}



function getTradNameMonth(month: string) {
    switch (month) {
        case "Janvier":
            return getTrad("Janvier")

        case "Février":
            return getTrad("Février")

        case "Mars":
            return getTrad("Mars")

        case "Avril":
            return getTrad("Avril")

        case "Mai":
            return getTrad("Mai")

        case "Juin":
            return getTrad("Juin")

        case "Juillet":
            return getTrad("Juillet")

        case "Août":
            return getTrad("Août")

        case "Septembre":
            return getTrad("Septembre")

        case "Octobre":
            return getTrad("Octobre")

        case "Novembre":
            return getTrad("Novembre")

        case "Décembre":
            return getTrad("Décembre")

        default:
            throw new Error("Le mois n'existe pas dans la traduction de l'application");
            break;
    }

}