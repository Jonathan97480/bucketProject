
import { Button, Icon, ListItem } from '@rneui/base';
import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { CompteInterface, setCurentBudget, setCurentCompte, setCurentMonth } from '../../../../redux/comptesSlice';
import globalStyle from '../../../../assets/styleSheet/globalStyle';

import { getTrad } from '../../../../lang/internationalization';

interface ComptesItemProps {
    item: CompteInterface;

    navigation?: any;
    editCallBack: (item: CompteInterface) => void;
    deleteCallBack: (id: number) => void;
}

export const ComptesItem = ({ item, navigation = undefined, editCallBack, deleteCallBack }: ComptesItemProps) => {

    const dispatch = useDispatch();



    function onPress() {
        if (navigation !== undefined) {
            dispatch(setCurentCompte(item))
            dispatch(setCurentMonth(null))
            dispatch(setCurentBudget(null))
            navigation.navigate("Tab");
        }
    }

    return (
        <View
            style={{ marginBottom: 10 }}
        >
            < ListItem.Swipeable

                onPress={() => onPress()}
                style={{
                    borderRadius: 20,
                    overflow: 'hidden',

                }}

                leftContent={(reset) => {
                    return <Button
                        containerStyle={{ borderRadius: 20, }}
                        title={"Éditer"}
                        onPress={() => {
                            editCallBack(item);
                            reset();
                        }}
                        icon={{ name: 'edit', color: 'white', }}
                        buttonStyle={{ minHeight: '100%' }} />;
                }}

                rightContent={(reset) => {

                    return <Button
                        containerStyle={{ borderRadius: 20, }}
                        title={"Supprimer"}
                        onPress={() => {

                            deleteCallBack(item.id);
                            reset();

                        }}
                        icon={{ name: 'delete', color: 'white' }}
                        buttonStyle={[{ minHeight: '100%', backgroundColor: 'red' }]}
                        color="#ffffff" />;

                }}

            >

                <Icon
                    name="account-balance-wallet"
                    size={54}
                    color="#817FE5"

                />
                <ListItem.Content>
                    <ListItem.Title style={[
                        globalStyle.textSizeXLarge,
                        globalStyle.textBold,
                        globalStyle.textAlignLeft
                    ]}>{item.name}</ListItem.Title>
                    <ListItem.Subtitle style={globalStyle.textSizeSmall}>{getTrad("pay")} : {item.pay.toFixed(2)}€</ListItem.Subtitle>

                    {item.discovered ? <ListItem.Subtitle style={globalStyle.textSizeSmall}>{getTrad("Overdraft")} : {item.discoveredMontant.toFixed(2)}€</ListItem.Subtitle> :
                        <ListItem.Subtitle style={globalStyle.textSizeSmall}>{getTrad("UnauthorizedOverdraft")}</ListItem.Subtitle>
                    }

                </ListItem.Content>

            </ListItem.Swipeable >

        </View>



    )


}



