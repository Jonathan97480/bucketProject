
import { Button, CheckBox, Input } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addComptesArray, CompteInterface, updateCompte } from '../../../../redux/comptesSlice';
import { createCompte, UpdateCompte } from './logic';
import { styleSheet } from './styleSheet';
import { CustomActivityIndicator } from '../../../../components';
import AllComptes from '../../AllComptes';



interface ModalAddCompteProps {
    visible: boolean;
    id_user: number;
    setVisible: (visible: boolean) => void;
    curentCompte?: CompteInterface | null;
    allComptes: CompteInterface[];
}

export const ModalAddCompte = ({ visible, setVisible, id_user, curentCompte, allComptes }: ModalAddCompteProps) => {

    const dispatch = useDispatch();

    const [Compte, setCompte] = useState(defaultFromState());
    const [isLoading, setIsLoading] = useState(false);
    console.log("curentCompte", curentCompte);
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
            const result = await createCompte(
                {
                    _nameCompte: Compte.name,
                    _idUser: id_user,
                    _Overdrawn: Compte.Overdrawn,
                    _isOverdrawn: Compte.isOverdrawn
                }
            );

            setTimeout(() => {

                setIsLoading(false);
                if (result) {
                    setCompte(defaultFromState());
                    dispatch(addComptesArray(result));
                    setVisible(false);
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
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                setVisible(false);
            }}
        >
            <View style={styleSheet.container}>
                <View
                    style={styleSheet.formContainer}
                >

                    <Input
                        placeholder="Nom du compte"
                        value={Compte.name}
                        errorMessage={Compte.errorName}
                        label="Nom du compte"
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
                        title={curentCompte ? "Sauvegarder" : "Ajouter"}
                        disabled={Compte.name.length <= 0 || Compte.errorName.length > 0}
                        onPress={onPress}
                    />
                </View>
                {
                    isLoading &&
                    <CustomActivityIndicator />
                }
            </View>

        </Modal>
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

    useEffect(() => {
        setChecked(isOverdrawn);
        setValue(overdrawn);
    }, [isOverdrawn, overdrawn]);

    return (
        <View >

            <CheckBox
                title="Autoriser le découvert"
                checked={checked}
                onPress={() => {
                    onChange(value, !checked);
                    setChecked(!checked);

                }}

            />

            {
                checked &&
                <Input
                    placeholder="Montant du découvert"
                    value={value}
                    label="Montant du découvert"
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