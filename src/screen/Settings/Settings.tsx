import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CustomSafeAreaView, CustomSection, Title } from "../../components";
import { Icon } from "@rneui/base";
import globalStyle from "../../assets/styleSheet/globalStyle";



export default function Settings() {
    return (
        <CustomSafeAreaView>
            <ScrollView >
                <Title title={"Réglages"} />

                <CustomSection>

                    <BtnSection
                        leftIcon="dollar-sign"
                        rightIcon="chevron-right"
                        textLeft="Devise"
                        textRight="Euro"
                        onPress={() => { }}
                    />
                    <BtnSection
                        leftIcon="language"
                        rightIcon="chevron-right"
                        textLeft="Langages"
                        textRight="French"
                        onPress={() => { }}
                    />
                </CustomSection>
                {/* A PROPOS */}
                <CustomSection
                    title="A propos"
                >
                    <Text
                        style={[globalStyle.colorTextPrimary, { lineHeight: 25 }]}
                    >
                        Lorem ipsum dolor sit amet consectetur. Enim morbi commodo cursus tortor. Senectus quam mauris quisque at viverra. Sem nunc tortor blandit odio ac condimentum odio pellentesque.
                    </Text>
                </CustomSection>
                {/* RESAUX SOCIAUX */}
                <CustomSection>

                    <BtnSection
                        leftIcon="facebook"
                        rightIcon="chevron-right"
                        textLeft="Facebook"
                        textRight="Voir Facebook"
                        onPress={() => { }}
                    />
                    <BtnSection
                        leftIcon="linkedin"
                        rightIcon="chevron-right"
                        textLeft="Linkedin"
                        textRight="Voir Linkedin"
                        onPress={() => { }}
                    />
                    <BtnSection
                        leftIcon="globe"
                        rightIcon="chevron-right"
                        textLeft="Site web"
                        textRight="Voir le site"
                        onPress={() => { }}
                    />
                </CustomSection>
                {/* CONTACT */}
                <CustomSection>

                    <BtnSection
                        leftIcon="envelope"
                        rightIcon="chevron-right"
                        textLeft="Email"
                        textRight="jon.dev974@gmail.fr"
                        onPress={() => { }}
                    />
                    <BtnSection
                        leftIcon="wrench"
                        rightIcon="chevron-right"
                        textLeft="Support"
                        textRight="wwww.support.com"
                        onPress={() => { }}
                    />
                </CustomSection>
            </ScrollView>

        </CustomSafeAreaView>

    );

}



interface BtnSectionProps {
    leftIcon: string;
    rightIcon: string;
    textLeft: string;
    textRight?: string;
    onPress: () => void;
}

function BtnSection(props: BtnSectionProps) {

    return (
        <TouchableOpacity
            onPress={() => props.onPress()}
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,

            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Icon
                    style={
                        {
                            marginRight: 10
                        }
                    }
                    name={props.leftIcon}
                    type="font-awesome-5"
                    size={13}
                    color={globalStyle.colorTextPrimary.color}
                />
                <Text
                    style={{
                        color: globalStyle.colorTextPrimary.color,
                        fontSize: 13,
                        fontWeight: "bold",
                        marginVertical: 5
                    }}
                >{props.textLeft}</Text>
            </View>
            <View

                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: globalStyle.colorTextPrimary.color,
                        fontSize: 13,
                        fontWeight: "bold",
                        marginVertical: 5
                    }}
                >{props.textRight}</Text>
                <Icon
                    style={
                        {
                            marginLeft: 10
                        }
                    }
                    name={props.rightIcon}
                    type="material-community"
                    size={20}
                    color={globalStyle.colorTextPrimary.color}
                />

            </View>
        </TouchableOpacity>
    )
}