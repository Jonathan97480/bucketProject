import { useEffect, useState } from "react";
import { setUser, user } from "../../redux/userSlice";
import React from "react";
import { GetAllUser, RemoveUserInDatabase } from "./logic";
import { getTrad } from "../../lang/internationalization";
import { Dimensions, FlatList, TouchableOpacity, View, Text, Image, Alert } from "react-native";
import { BannerAds, CustomActivityIndicator, CustomSafeAreaView, Title } from "../../components";
import globalStyle from "../../assets/styleSheet/globalStyle";
import { Button, FAB, Icon, ListItem } from "@rneui/base";
import { GetUser } from "./logic";
import { useDispatch } from "react-redux";



export default function SelectUser({ navigation }: { navigation: any }) {

    const [allUser, setAllUser] = useState<user[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
        GetAllUserCallBack();
    }, [])

    const GetAllUserCallBack = React.useCallback(async () => {
        setIsLoading(true);
        const result = await GetAllUser()
        if (result.users !== null) {
            setAllUser(result.users);

            setIsLoading(false);

            if (result.userAutoLogin) {
                const user = await GetUser();
                if (user) {
                    dispatch(setUser(user));
                    navigation.replace("AllComptes")

                }

            }

        }
    }, [])

    const handleRemoveUser = async (id_user: number) => {

        Alert.alert(
            getTrad("DeleteUser"),
            getTrad("AreYouSureYouWantToDeleteThisUser"),
            [
                {
                    text: getTrad("cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: getTrad("ok"), onPress: async () => {
                        setIsLoading(true);
                        const result = await RemoveUserInDatabase(id_user);
                        if (result.isRemove) {
                            GetAllUserCallBack();
                        }
                        setIsLoading(false);
                    }
                }

            ],
            { cancelable: false }
        );


    }

    return (
        <CustomSafeAreaView>
            <BannerAds
                key="ca-app-pub-2398424925470703/1921992074"
            />
            <View style={[{
                flex: 1,

                justifyContent: "center",
                flexDirection: "column",
            }]}>

                {isLoading && <CustomActivityIndicator />}
                <Title title={getTrad("SelectUser")} />

                <FlatList
                    style={
                        {
                            width: "100%",

                        }
                    }
                    data={allUser}
                    renderItem={({ item }) => <UserItem user={item} navigation={navigation} removeCallBack={handleRemoveUser} />}
                    keyExtractor={item => item.id.toString()}
                    ListEmptyComponent={() => <EmptyUser />}
                />
                <FAB

                    color={globalStyle.fabColor.backgroundColor}
                    placement="right"
                    icon={
                        <Icon
                            name="user-plus"
                            type="font-awesome"
                            color="#fff"
                            size={20}
                        />
                    }
                    onPress={() => {
                        console.log("register")
                        navigation.navigate("LoginSinging", {
                            isAsUser: false,
                            identifiant: null,

                        })

                    }

                    }
                />
            </View>
        </CustomSafeAreaView>
    )
}

const UserItem = ({ user, navigation, removeCallBack }: { user: user, navigation: any, removeCallBack: (value: number) => void }) => {

    const { width } = Dimensions.get("window");

    return (
        <View
            style={{
                maxWidth: width > 500 ? 500 : "95%",
                marginTop: 10,
                alignSelf: "center",

            }}
        >
            <ListItem.Swipeable style={{
                borderRadius: 20,
                overflow: 'hidden',
                width: width > 500 ? 500 : width * 0.8,
                maxWidth: width > 500 ? 500 : "100%",



            }}
                containerStyle={{
                    backgroundColor: "#17a2b8",

                }}
                onPress={() => {
                    navigation.navigate("LoginSinging", {


                        isAsUser: true,
                        identifiant: user.identifiant,

                    })
                }}

                rightContent={(reset) => {

                    return <Button
                        containerStyle={globalStyle.btnContainerStyle}
                        title={getTrad("Delete")}
                        titleStyle={[globalStyle.btnTitleStyle, { fontSize: globalStyle.textSizeSmall.fontSize }]}
                        radius={25}
                        onPress={() => {

                            removeCallBack(user.id);
                            reset();

                        }}
                        icon={{ name: 'delete', color: 'white' }}
                        buttonStyle={[{ minHeight: '100%', backgroundColor: 'red' }]}
                        color="#ffffff" />;

                }}
            >
                <Icon
                    name="user"
                    type="font-awesome"
                    color="#f8f9fa"
                    size={width > 500 ? 40 : 30}
                />
                <ListItem.Content>

                    <ListItem.Title
                        style={
                            {
                                fontSize: globalStyle.textSizeMedium.fontSize,
                                fontWeight: "bold",
                                textAlign: "center",
                                color: "#fff",
                            }
                        }
                    >{user.identifiant}
                    </ListItem.Title>

                </ListItem.Content>

            </ListItem.Swipeable>
        </View>

    )

}


const EmptyUser = () => {

    return (
        <View
            style={[{

                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                flex: 1,
                height: Dimensions.get("window").height / 1.2,
            }]}
        >

            <Image
                style={{
                    width: "100%",
                    height: 400,
                    maxWidth: 600,

                }}
                resizeMethod="resize"
                resizeMode="contain"
                source={require("../../assets/images/EmptyUser.png")}
            />
            <Text
                style={[globalStyle.textSizeMedium, globalStyle.colorTextPrimary, { textAlign: "center" }]}
            >{getTrad("NoUser")}</Text>

        </View>
    )


}