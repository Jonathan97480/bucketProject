import { View, Text } from "react-native";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import { MonthInterface } from "../../../../redux/comptesSlice";
import styleSheet from "./styleSheet";

interface ArchiveItemProps {

    months: MonthInterface[] | null;
    year: number;

}

export default function ArchiveItem({ months, year }: ArchiveItemProps) {

    if (months === null) {
        months = []
    }

    console.log(months)
    return (
        <>
            {
                months.map((month: any, index: number) => {

                    return (<View style={[styleSheet.blockMonthSelect, globalStyle.backgroundSecondaryColor]}
                        key={'archive-' + index}
                    >

                        <Text style={[styleSheet.blockCurentMonthText, globalStyle.colorTextPrimary]}>{month.nameMonth} {year}</Text>
                        <Text style={[globalStyle.textSizeSmall, globalStyle.colorTextPrimary]} >{month.transactions.length} transactions</Text>
                    </View>
                    )
                })
            }


        </>
    )
}