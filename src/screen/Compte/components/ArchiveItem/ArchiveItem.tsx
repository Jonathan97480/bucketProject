import { View, Text, Dimensions, FlatList, TouchableOpacity } from "react-native";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { MonthInterface, TransactionMonthInterface } from "../../../../redux/comptesSlice";
import styleSheet from "./styleSheet";
import { getTrad } from "../../../../lang/internationalization";
import { getMonthByNumber } from "../../../../utils/DateManipulation";
import { useNavigation } from "@react-navigation/native";
interface ArchiveItemProps {

    months: MonthInterface[] | null;
    year: number;
    openStat: (month: MonthInterface) => void;


}



export default function ArchiveItem({ months, year, openStat }: ArchiveItemProps) {



    if (months === null) {
        return <>
            <View style={[styleSheet.blockMonthSelect, globalStyle.backgroundSecondaryColor]}>
                <Text style={[styleSheet.blockCurentMonthText, globalStyle.colorTextPrimary]}>{getTrad("NoMonthData")}</Text>
            </View>
        </>
    }


    const monthReverse = months.slice(0).reverse();

    return (
        <FlatList
            data={monthReverse}
            keyExtractor={(item, index) => item.nameMonth + "-" + index.toString()}
            renderItem={({ item }) => <ItemMonth month={item} year={year.toString()} openStat={openStat} />}

        />

    )
}


const ItemMonth = ({ month, year, openStat }: { month: MonthInterface, year: string, openStat: (month: MonthInterface) => void }) => {

    const { width } = Dimensions.get('window');
    const numberTransaction = month.transactions.expense.length + month.transactions.income.length
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => {
                if (month.nameMonth === getMonthByNumber(new Date().getMonth() + 1)) {
                    navigation.navigate("transactions")

                } else {
                    openStat(month)
                }
            }}

            style={[styleSheet.blockMonthSelect, globalStyle.backgroundSecondaryColor]}>
            <Text
                style={[styleSheet.blockCurentMonthText,
                globalStyle.colorTextPrimary, { fontSize: width * 0.04 }]}>
                {getTradNameMonth(month.nameMonth)} {year}
            </Text>
            <Text style={[{ fontSize: width * 0.031 }, globalStyle.colorTextPrimary]} >{numberTransaction} {getTrad("transactions")}</Text>
        </TouchableOpacity>


    );
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