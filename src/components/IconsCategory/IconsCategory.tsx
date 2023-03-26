import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import styleSheet from "./styleSheet";
import { useSelector } from "react-redux";
import { IconAlimentation, IconAutres, IconLogement, IconLoisir, IconSanté, IconVetement } from "../../utils/IconCustom";
import { CategoryInterface } from "../../redux/categorySlice";
import { Icon } from "@rneui/base";

interface Props {
    id_category: number,
}


export default function IconsCategory({ id_category }: Props) {

    const categories: CategoryInterface[] = useSelector((state: any) => state.category.category);


    return (
        <View style={styleSheet.container}>
            {categories.map((category: CategoryInterface, index: number) => {

                if (category.id === id_category) {

                    switch (category.name) {
                        case "Alimentation":
                            return <IconAlimentation key={`category_key-${index}`} />
                        case "Logement":
                            return <IconLogement key={`category_key-${index}`} />
                        case "Vêtements":
                            return <IconVetement key={`category_key-${index}`} />
                        case "Loisirs":
                            return <IconLoisir key={`category_key-${index}`} />
                        case "Santé":
                            return <IconSanté key={`category_key-${index}`} />
                        case "Autres":
                            return <IconAutres key={`category_key-${index}`} />
                        default:
                            return <IconAutres key={`category_key-${index}`} />
                    }
                }
                return null
            })

            }

        </View>
    )

}