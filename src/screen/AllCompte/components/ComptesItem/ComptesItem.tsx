
import { Icon } from '@rneui/base';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { deleteCompte } from './logic';
import { styleSheet } from './styleSheet';
import { useDispatch } from 'react-redux';
import { deleteCompteArray } from '../../../../redux/comptesSlice';
import { CustomActivityIndicator } from '../../../../components';
import globalStyle from '../../../../assets/styleSheet/globalStyle';



interface ComptesItemProps {
    item: any;
    id_user: number;
    navigation?: any;
}

export const ComptesItem = ({ item, navigation = undefined, id_user }: ComptesItemProps) => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={[{ position: "relative", overflow: "hidden" }]}>

            <TouchableOpacity
                style={styleSheet.container}
                onPress={() => {
                    if (navigation !== undefined) {
                        navigation.navigate("Tab");
                    }
                }}
                onLongPress={onLongPress}
            >

                <View style={styleSheet.headerCard}>

                    <Icon
                        name="account-balance-wallet"
                        size={54}
                        color="#817FE5"

                    />

                    <Text style={[globalStyle.textAlignLeft, globalStyle.textSizeLarge]}>{item.name}</Text>


                </View>



            </TouchableOpacity>
            {
                isLoading &&
                <CustomActivityIndicator
                    size={30}
                />}

        </View>
    )

    function onLongPress() {


        Alert.alert(
            "Supprimer le compte",
            "Voulez vous vraiment supprimer ce compte ?",
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Oui", onPress: async () => {
                        {
                            setIsLoading(true)

                            await deleteCompte({

                                id_user: id_user,
                                id_compte: item.id

                            })

                            setTimeout(() => {

                                setIsLoading(false)
                                dispatch(deleteCompteArray(item.id))

                            }, 1000);
                        }
                    }
                }
            ],
            { cancelable: false }
        );

    }
}



