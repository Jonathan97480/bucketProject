
import { Button, CheckBox, Icon, Input } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { View, Dimensions, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addComptesArray, CompteInterface, updateCompte } from '../../../../redux/comptesSlice';
import { createCompte, UpdateCompte } from './logic';
import { styleSheet } from './styleSheet';
import { CustomActivityIndicator, CustomModal } from '../../../../components';
import { getTrad } from '../../../../lang/internationalization';
import globalStyle from '../../../../assets/styleSheet/globalStyle';



interface ModalAddCompteProps {
    visible: boolean;
    id_user: number;
    setVisible: (visible: boolean) => void;
    curentCompte?: CompteInterface | null;
    allComptes: CompteInterface[];

}

export const ModalAddCompte = ({ visible, setVisible, id_user, curentCompte, allComptes }: ModalAddCompteProps) => {

    const dispatch = useDispatch();

    const { width } = Dimensions.get('window');

    const [Compte, setCompte] = useState(defaultFromState());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (curentCompte) {
            setCompte({
                name: curentCompte.name,
                errorName: "",
                isOverdrawn: curentCompte.discovered,
                Overdrawn: curentCompte.discoveredMontant.toString(),
            });


        } else {
            setCompte(defaultFromState());
        }
    }, [curentCompte]);



    async function onPress() {

        setIsLoading(true);

        if (!curentCompte) {
            const res = await createCompte(
                {
                    _nameCompte: Compte.name,
                    _idUser: id_user,
                    _Overdrawn: Compte.Overdrawn,
                    _isOverdrawn: Compte.isOverdrawn,
                    _AllComptes: allComptes

                }
            );

            setTimeout(() => {

                setIsLoading(false);
                if (!res.alert) {
                    setCompte(defaultFromState());
                    dispatch(addComptesArray(res.compte));
                    setVisible(false);
                } else {

                    Alert.alert(res.alert.alert?.type || "", res.alert.alert?.message, [
                        {
                            text: getTrad("ok"),
                            onPress: () => { }
                        },
                        {
                            text: getTrad("cancel"),
                            onPress: () => { }
                        }
                    ]);
                }

            }, 500);
        } else {

            const result = await UpdateCompte({
                oldCompte: curentCompte,
                nameCompte: Compte.name,
                Overdrawn: Compte.Overdrawn,
                allCompte: allComptes,
                isOverdrawn: Compte.isOverdrawn


            })

            setTimeout(() => {

                setIsLoading(false);
                if (result) {
                    setCompte(defaultFromState());
                    dispatch(updateCompte(result))
                    setVisible(false);

                }

            }, 500);

        }


    }

    function defaultFromState() {
        return {
            name: "",
            errorName: "",
            isOverdrawn: false,
            Overdrawn: "",


        }
    }

    return (
        <CustomModal
            visible={visible}
            animationType="slide"
            transparent={true}
            setIsVisible={setVisible}
            title={curentCompte ? getTrad("EditAccount") : getTrad("AddAccount")}
            backgroundColor='#282525'
            titleStyle={globalStyle.titleStyle}
            containerStyle={globalStyle.modalContainerStyleForm}

        >

            <View
                style={globalStyle.containerForm}
            >

                <Input
                    placeholder={getTrad("AccountName")}
                    value={Compte.name}
                    errorMessage={Compte.errorName}
                    label={getTrad("AccountName")}
                    labelStyle={globalStyle.labelStyle}
                    inputStyle={globalStyle.inputStyle}
                    inputContainerStyle={globalStyle.inputContainerStyle}

                    onChangeText={text => setCompte((prevState) => {
                        return {
                            ...prevState,
                            name: text,

                        }
                    })}

                />
                <Overdrawn

                    onChange={(value: string, isOverdrawn: boolean) => {

                        setCompte((prevState) => {
                            return {
                                ...prevState,
                                Overdrawn: value,
                                isOverdrawn: isOverdrawn

                            }
                        })
                    }}
                    isOverdrawn={Compte.isOverdrawn}
                    overdrawn={Compte.Overdrawn}

                />
                <Button
                    title={curentCompte ? getTrad("Save") : getTrad("Add")}
                    titleStyle={globalStyle.btnTitleStyle}
                    containerStyle={globalStyle.btnContainerStyle}
                    buttonStyle={globalStyle.btnStyle}
                    radius={25}
                    onPress={onPress}
                    iconPosition='right'
                    icon={
                        <Icon
                            name="check"
                            type="font-awesome"
                            size={20}
                            color="#fff"
                            style={{ marginLeft: 10 }}
                        />

                    }
                />
                {
                    isLoading &&
                    <CustomActivityIndicator />
                }
            </View>

        </CustomModal>
    );

}


const Overdrawn = ({
    onChange,
    isOverdrawn,
    overdrawn,

}: {
    onChange: (text: string, isOverdrawn: boolean) => void;
    isOverdrawn: boolean;
    overdrawn: string;

}) => {

    const [checked, setChecked] = useState(isOverdrawn);
    const [value, setValue] = useState(overdrawn);
    const { width } = Dimensions.get('window');

    useEffect(() => {
        setChecked(isOverdrawn);
        setValue(overdrawn);
    }, [isOverdrawn, overdrawn]);

    return (
        < >

            <CheckBox
                title={getTrad("AuthorizeOverdraft")}
                textStyle={globalStyle.titleStyleCheckBox}
                containerStyle={globalStyle.containerCheckBoxStyle}
                checked={checked}
                style={globalStyle.checkBoxStyle}

                checkedColor={globalStyle.checkedColorCheckBox.color}
                size={width * 0.06}
                onPress={() => {
                    onChange(value, !checked);
                    setChecked(!checked);

                }}

            />

            {
                checked &&
                <Input
                    placeholder={getTrad("OverdraftAmount")}
                    labelStyle={globalStyle.labelStyle}
                    inputStyle={globalStyle.inputStyle}
                    inputContainerStyle={globalStyle.inputContainerStyle}
                    value={value}
                    label={getTrad("OverdraftAmount")}
                    keyboardType="numeric"
                    onChangeText={text => {
                        onChange(text, checked)
                        setValue(text);

                    }
                    }
                />
            }
        </>
    );

};