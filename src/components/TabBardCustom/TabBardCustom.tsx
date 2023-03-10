import { TouchableOpacity, View, Text, Image } from "react-native";
import globalStyle from "../../assets/styleSheet/globalStyle";
import styleSheet from "./styleSheet";
export default function TabBardCustom({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) {


    return (
        <View
            style={styleSheet.tabBar}>
            {state.routes.map((route: any, index: any) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;
                const isFocused = state.index === index;

                const myIcon: any = getIconByRouteName(route.name, isFocused);


                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={index + "-bottom-tab"}
                        accessibilityRole="button"
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {myIcon}
                        <Text
                            style={[{
                                color: isFocused ? '#9747FF' : '#fff',
                            }, globalStyle.textSizeSmall]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
function getIconByRouteName(name: string, isFocused: boolean): React.ReactNode {


    switch (name) {
        case "Compte":
            return <Image source={require("../../assets/images/Wallet.png")} style={[styleSheet.icon, {
                tintColor: isFocused ? '#9747FF' : '#fff',
            }]} />;
        case "transactions":
            return <Image source={require("../../assets/images/piggy_bank.png")} style={[styleSheet.icon, {
                tintColor: isFocused ? '#9747FF' : '#fff',
            }]} />;
        case "Liste":
            return <Image source={require("../../assets/images/list.png")} style={[styleSheet.icon, {
                tintColor: isFocused ? '#9747FF' : '#fff',
            }]} />;
        default:
            return <Image source={require("../../assets/images/Wallet.png")} style={[styleSheet.icon, {
                tintColor: isFocused ? '#9747FF' : '#fff',
            }]} />;

    }

}