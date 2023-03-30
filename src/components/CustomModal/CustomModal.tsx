import { Animated, Modal, View } from "react-native";
import React from "react";
import { Icon } from "@rneui/base";



interface CustomModalProps {
    visible: boolean,
    setIsVisible: (isVisible: boolean) => void,
    animationType: "slide" | "none" | "fade" | undefined,
    transparent: boolean,
    children: React.ReactNode,
}

export const CustomModal = React.memo((props: CustomModalProps) => {

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


            <View style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,

            }}>
                <View
                    style={{
                        width: "100%",


                    }}
                >
                    <View
                        style={{
                            width: "100%",

                            backgroundColor: "#fff",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            padding: 10,
                        }}
                    >
                        <Icon
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                padding: 10,
                            }}

                            name="close"
                            size={30}
                            onPress={() => {
                                props.setIsVisible(false);
                            }}
                        />
                        {props.children}
                    </View>

                </View>

            </View>


        </Modal>
    );

})

