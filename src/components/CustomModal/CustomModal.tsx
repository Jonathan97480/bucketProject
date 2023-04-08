import { Animated, Modal, View, Text, Dimensions } from "react-native";
import React from "react";
import { Icon } from "@rneui/base";



interface CustomModalProps {
    visible: boolean,
    setIsVisible: (isVisible: boolean) => void,
    animationType?: "slide" | "none" | "fade" | undefined,
    transparent?: boolean,
    children: React.ReactNode,
    title?: string,
    disableCenterPosition?: boolean,
    backgroundColor?: string,
    titleStyle?: any,
    containerStyle?: any,
}

export const CustomModal = React.memo((props: CustomModalProps) => {

    const { width, height } = Dimensions.get('window');

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
                props.setIsVisible(false);
            }
            }
        >


            <View style={[
                { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
                props.disableCenterPosition ? {


                } :
                    {


                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,

                    }]}>
                <View
                    style={[{
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    },
                    props.disableCenterPosition ? {
                        flex: 1

                    } :
                        {}
                    ]}
                >
                    <View
                        style={props.containerStyle ? props.containerStyle : {
                            width: "100%",
                            backgroundColor: props.backgroundColor ? props.backgroundColor : "#fff",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            padding: 10,
                            paddingHorizontal: 20,

                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                            }}
                        >
                            <View></View>
                            <Text
                                style={props.titleStyle ? props.titleStyle : {

                                    fontSize: width * 0.05,
                                    fontWeight: 'bold',
                                    textAlign: 'center',

                                }}
                            >{props.title}</Text>
                            <Icon
                                name="close"
                                size={width > 600 ? 40 : 30}
                                color="#ffff"

                                onPress={() => {
                                    props.setIsVisible(false);
                                }}
                            />
                        </View>
                        {props.children}
                    </View>

                </View>

            </View>


        </Modal>
    );

})

