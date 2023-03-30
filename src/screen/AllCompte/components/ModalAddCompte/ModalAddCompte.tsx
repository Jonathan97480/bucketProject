
import { Button, CheckBox, Input } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addComptesArray, CompteInterface, updateCompte } from '../../../../redux/comptesSlice';
import { createCompte, UpdateCompte } from './logic';
import { styleSheet } from './styleSheet';
import { CustomActivityIndicator, CustomModal } from '../../../../components';
import AllComptes from '../../AllComptes';
import { getTrad } from '../../../../lang/internationalization';



interface ModalAddCompteProps {
    visible: boolean;
    id_user: number;
    setVisible: (visible: boolean) => void;
    curentCompte?: CompteInterface | null;
    allComptes: CompteInterface[];
    trad: any;
}

export const ModalAddCompte = ({ visible, setVisible, id_user, curentCompte, allComptes, trad }: ModalAddCompteProps) => {

    const dispatch = useDispatch();

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
        >

            <View
                style={styleSheet.formContainer}
            >

                <Input
                    placeholder={trad.AccountName}
                    value={Compte.name}
                    errorMessage={Compte.errorName}
                    label={trad.AccountName}
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
                    trad={trad}
                />
                <Button
                    title={curentCompte ? trad.Save : trad.Add}
                    disabled={Compte.name.length <= 0 || Compte.errorName.length > 0}
                    onPress={onPress}
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
    trad
}: {
    onChange: (text: string, isOverdrawn: boolean) => void;
    isOverdrawn: boolean;
    overdrawn: string;
    trad: any;
}) => {

    const [checked, setChecked] = useState(isOverdrawn);
    const [value, setValue] = useState(overdrawn);

    useEffect(() => {
        setChecked(isOverdrawn);
        setValue(overdrawn);
    }, [isOverdrawn, overdrawn]);

    return (
        <View >

            <CheckBox
                title={trad.AuthorizeOverdraft}
                checked={checked}
                onPress={() => {
                    onChange(value, !checked);
                    setChecked(!checked);

                }}

            />

            {
                checked &&
                <Input
                    placeholder={trad.OverdraftAmount}
                    value={value}
                    label={trad.OverdraftAmount}
                    keyboardType="numeric"
                    onChangeText={text => {
                        onChange(text, checked)
                        setValue(text);

                    }
                    }
                />
            }
        </View>
    );

};