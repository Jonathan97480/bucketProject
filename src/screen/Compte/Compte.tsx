import React, { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import globalStyle from "../../assets/styleSheet/globalStyle";
import styleSheet from "./styleSheet";
import ArchiveItem from "./components/ArchiveItem/ArchiveItem";
import InfoCompte from "./components/InfoCompte/InfoCompte";
import { useSelector, useDispatch } from "react-redux";
import { addComptes, CompteInterface, MonthInterface, setCurentCompte, setCurentMonth, TransactionInterface } from "../../redux/comptesSlice";
import { getMonthByNumber } from "../../utils/DateManipulation";
import { FixeIsYearAndMonthExist } from "./logic";
import { userInterface } from "../../redux/userSlice";
import { CustomActivityIndicator, CustomModal } from "../../components";


export default function Compte() {



    const dispatch = useDispatch();

    const { width } = Dimensions.get('window');
    const currentCompte: CompteInterface = useSelector((state: any) => state.compte.currentCompte);
    const currentMonth: MonthInterface = useSelector((state: any) => state.compte.currentMonth);
    const user: userInterface = useSelector((state: any) => state.user);
    const [isLoading, setIsLoading] = React.useState(false);


    const [Statistiques, setStatistiques] = React.useReducer((state: any, action: { type: string, payload?: any }) => {

        switch (action.type) {
            case 'open':
                return {
                    data: action.payload,
                    isStatistiquesModalVisible: true
                };
            case 'close':
                return {
                    data: null,
                    isStatistiquesModalVisible: false
                };
            default:
                return state;
        }


    }, { isStatistiquesModalVisible: false })


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


    const transactionsListeReverse = currentCompte.transactions.slice(0).reverse();



    return (



        <View style={[globalStyle.backgroundPrimaryColor, { maxHeight: "100%", height: "100%" }]}>
            {
                isLoading === false ? <CustomActivityIndicator /> :
                    <>
                        <InfoCompte
                            compte={currentCompte}

                        />

                        <View style={[styleSheet.container, { flex: 1, alignSelf: "center" }]}>

                            {

                                transactionsListeReverse.map((YearTransaction, index) => {
                                    return (
                                        <View
                                            key={`list-index-${index}`}>
                                            <Text style={[
                                                { fontSize: width * 0.05 },
                                                globalStyle.colorTextPrimary,
                                                globalStyle.textAlignCenter,
                                                globalStyle.marginVertical
                                            ]} >{YearTransaction.year} </Text>

                                            <ArchiveItem
                                                months={YearTransaction.month}
                                                year={YearTransaction.year}
                                                openStat={(value: MonthInterface) => {
                                                    setStatistiques({ type: 'open', payload: value });
                                                }}

                                            />
                                        </View>

                                    )
                                })

                            }


                        </View>
                    </>
            }
            <ModalStatistics
                visible={Statistiques.isStatistiquesModalVisible}
                setIsVisible={() => {
                    setStatistiques({ type: 'close' })
                }}
                data={Statistiques.data}

            />
        </View>

    )

}




function ModalStatistics(props: { visible: boolean, setIsVisible: (value: boolean) => void, data: MonthInterface }) {

    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = React.useState<any>(null);

    useEffect(() => {
        if (props.data !== null) {

            setData(props.data);
        }
    }, [props.data]);

    return (
        <CustomModal
            visible={false}
            title="Statistiques"
            setIsVisible={() => { }}
        >
            <Text> WORK IN PROGRESSE </Text>

        </CustomModal>
    )




}