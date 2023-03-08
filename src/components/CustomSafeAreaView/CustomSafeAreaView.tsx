import { StatusBar } from "expo-status-bar";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import styleSheet from "./styleSheet";
import globalStyle from "../../assets/styleSheet/globalStyle";

interface CustomSafeAreaViewProps {

    children: any
}

export default function CustomSafeAreaView({ children }: CustomSafeAreaViewProps) {

    /* get theme mobile */
    const { colors } = useTheme();




    return (
        <SafeAreaView style={[styleSheet.container, globalStyle.backgroundPrimaryColor]}  >
            <StatusBar style="light" />
            {children}
        </SafeAreaView>
    )


}