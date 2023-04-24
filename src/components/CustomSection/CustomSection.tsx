import React from "react";
import { View, Text } from "react-native";
import { CustomSafeAreaView, Title } from "../../components";



interface CustomSectionProps {
    children: React.ReactNode;
    title?: string;
}
export default function CustomSection(props: CustomSectionProps) {

    return (
        <View
            style={{
                marginVertical: 10,

            }}
        >
            {props.title && <Text
                style={{
                    marginBottom: 10,
                    color: "#fff",
                    fontSize: 13,
                }}
            >
                {props.title}
            </Text>
            }
            <View style={{
                backgroundColor: "#231d1d",
                padding: 8,
                paddingVertical: 10,
                borderRadius: 10,
                justifyContent: "space-between",
            }}>
                {props.children}
            </View>
        </View>
    );


}