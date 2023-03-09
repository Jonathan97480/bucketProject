


import { Button, Input } from '@rneui/base';
import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addComptesArray } from '../../../../redux/comptesSlice';
import { creteCompte } from './logic';
import { styleSheet } from './styleSheet';
import { CustomActivityIndicator } from '../../../../components';



interface ModalAddCompteProps {
    visible: boolean;
    id_user: number;
    setVisible: (visible: boolean) => void;
}

export const ModalAddCompte = ({ visible, setVisible, id_user }: ModalAddCompteProps) => {

    const [Compte, setCompte] = useState(defaultFromState());
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

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
                    <Button
                        title="Ajouter"
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

    async function onPress() {
        setIsLoading(true);
        const result = await creteCompte(
            {
                nameCompte: Compte.name,
                idUser: id_user,
            }
        );
        setTimeout(() => {

            setIsLoading(false);
            if (result) {
                setCompte(defaultFromState());
                dispatch(addComptesArray(result));
                setVisible(false);
            }

        }, 1000);

    }

    function defaultFromState() {
        return {
            name: "",
            errorName: "",

        }
    }


}

