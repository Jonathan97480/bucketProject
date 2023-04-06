
import { Button, Icon, ListItem } from '@rneui/base';
import React from 'react';
import { View, Dimensions } from 'react-native';
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

    const { width } = Dimensions.get('window');

    function onPress() {
        if (navigation !== undefined) {
            dispatch(setCurentCompte(item))
            dispatch(setCurentMonth(null))
            dispatch(setCurentBudget(null))
            navigation.navigate("Tab");
        }
    }

    return (

        < ListItem.Swipeable

            onPress={() => onPress()}
            style={{
                borderRadius: 20,
                overflow: 'hidden',
                width: width > 500 ? 500 : width * 0.8,
                maxWidth: width > 500 ? 500 : "100%",


            }}

            leftContent={(reset) => {
                return <Button
                    containerStyle={globalStyle.btnContainerStyle}
                    radius={25}
                    title={getTrad("Edit")}
                    onPress={() => {
                        editCallBack(item);
                        reset();
                    }}
                    icon={{ name: 'edit', color: 'white', }}
                    buttonStyle={{ minHeight: '100%' }} />;
            }}

            rightContent={(reset) => {

                return <Button
                    containerStyle={globalStyle.btnContainerStyle}
                    title={getTrad("Delete")}
                    titleStyle={globalStyle.btnTitleStyle}
                    radius={25}
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
                size={width * 0.13}
                color="#817FE5"

            />
            <ListItem.Content>
                <ListItem.Title style={[
                    { fontSize: width * 0.05 },
                    globalStyle.textBold,
                    globalStyle.textAlignLeft
                ]}>{item.name}</ListItem.Title>
                <ListItem.Subtitle style={{ fontSize: width * 0.031 }}>{getTrad("pay")} : {item.pay.toFixed(2)}€</ListItem.Subtitle>

                {item.discovered ? <ListItem.Subtitle style={{ fontSize: width * 0.031 }}>{getTrad("Overdraft")} : {item.discoveredMontant.toFixed(2)}€</ListItem.Subtitle> :
                    <ListItem.Subtitle style={{ fontSize: width * 0.031 }}>{getTrad("UnauthorizedOverdraft")}</ListItem.Subtitle>
                }

            </ListItem.Content>

        </ListItem.Swipeable >





    )


}



