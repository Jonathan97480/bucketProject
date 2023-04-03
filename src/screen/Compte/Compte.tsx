import React, { useEffect } from "react";
import { View, ScrollView, Text, Dimensions, FlatList } from "react-native";
import globalStyle from "../../assets/styleSheet/globalStyle";
import styleSheet from "./styleSheet";
import ArchiveItem from "./components/ArchiveItem/ArchiveItem";
import InfoCompte from "./components/InfoCompte/InfoCompte";
import { useSelector, useDispatch } from "react-redux";
import { addComptes, CompteInterface, MonthInterface, setCurentCompte, setCurentMonth, TransactionInterface } from "../../redux/comptesSlice";
import { getMonthByNumber } from "../../utils/DateManipulation";
import { FixeIsYearAndMonthExist } from "./logic";
import { userInterface } from "../../redux/userSlice";
import { CustomActivityIndicator } from "../../components";
export default function Compte() {



    const dispatch = useDispatch();

    const { width } = Dimensions.get('window');
    const currentCompte: CompteInterface = useSelector((state: any) => state.compte.currentCompte);
    const currentMonth: MonthInterface = useSelector((state: any) => state.compte.currentMonth);
    const user: userInterface = useSelector((state: any) => state.user);
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        if (!isLoading) {

            FixeIsYearAndMonthExist(currentCompte, user.user?.id!).then((result) => {
                setIsLoading(true)
                dispatch(setCurentCompte(result.compte))
                if (result.AllComptes) {
                    dispatch(addComptes(result.AllComptes))
                }
            }).catch((error) => {
                console.log("ERROR", error)
            })
        } else {
            if (currentMonth === null && currentCompte !== null) {

                currentCompte.transactions.find((transactionsParYear: TransactionInterface) => {

                    if (transactionsParYear.year === new Date().getFullYear()) {
                        transactionsParYear.month.find((month: MonthInterface) => {
                            if (month.nameMonth === getMonthByNumber(new Date().getMonth() + 1)) {
                                dispatch(setCurentMonth(month))
                                return month
                            }
                        })
                    }
                })

            }
        }




    }, [currentCompte])






    return (



        <View style={[globalStyle.backgroundPrimaryColor, { maxHeight: "100%", height: "100%" }]}>
            {
                isLoading === false ? <CustomActivityIndicator /> :
                    <>
                        <InfoCompte
                            compte={currentCompte}

                        />

                        <View style={styleSheet.container}>

                            <ScrollView style={[styleSheet.scrollview,]}>

                                <View style={[globalStyle.containerCenter, { alignItems: "center" }]}>
                                    {

                                        currentCompte.transactions.slice(0).reverse().map((YearTransaction, index) => {
                                            return (
                                                <View key={`list-index-${index}`}>
                                                    <Text style={[
                                                        { fontSize: width * 0.05 },
                                                        globalStyle.colorTextPrimary,
                                                        globalStyle.textAlignCenter,
                                                        globalStyle.marginVertical
                                                    ]} >{YearTransaction.year} </Text>

                                                    <ArchiveItem
                                                        months={YearTransaction.month}
                                                        year={YearTransaction.year}

                                                    />
                                                </View>

                                            )
                                        })

                                    }
                                </View>
                            </ScrollView>

                        </View>
                    </>
            }
        </View>

    )

}




