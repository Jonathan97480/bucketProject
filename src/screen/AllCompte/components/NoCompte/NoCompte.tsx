import { View, Text, Image } from "react-native";
import globalStyle from "../../../../assets/styleSheet/globalStyle";
import styleSheet from "./styleSheet";

export default function NoCompte(props: { trad: any }) {

    return (
        <View style={styleSheet.container} >
            <Image style={[styleSheet.marginBottom, styleSheet.image]}
                resizeMode="contain"

                source={require('../../../../assets/images/logo_app.png')} />
            <Text style={[globalStyle.textAlignCenter, globalStyle.colorTextPrimary, globalStyle.textSizeMedium, styleSheet.marginBottom]} >{props.trad.ToGetStartedAccount}</Text>
        </View>
    )
}