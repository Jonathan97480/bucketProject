import { StatusBar } from "expo-status-bar";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import styleSheet from "./styleSheet";
import globalStyle from "../../assets/styleSheet/globalStyle";

interface CustomSafeAreaViewProps {

    children: any
    paddingEnabled?: boolean
}

export default function CustomSafeAreaView({ children, paddingEnabled = true }: CustomSafeAreaViewProps) {

    /* get theme mobile */
    const { colors } = useTheme();

    const padding = paddingEnabled ? 32 : 0;

    return (
        <SafeAreaView style={[styleSheet.container, globalStyle.backgroundPrimaryColor, { padding: padding }]}  >
            <StatusBar style="light" />
            {children}
        </SafeAreaView>
    )


}