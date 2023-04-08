import React, { useState, useEffect, useReducer } from "react";
import { GetIsAsUser } from "./logic";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectUser from "./SelectUser";
import ScreenLoginAndRegister from "./Login";

export default function LoginAndRegister({ navigation }: any) {

    const stackLoginAndRegister = createNativeStackNavigator();

    return (

        <stackLoginAndRegister.Navigator initialRouteName="Select_user" screenOptions={{ headerShown: false, }}>
            <stackLoginAndRegister.Screen name="LoginSinging" component={ScreenLoginAndRegister} />
            <stackLoginAndRegister.Screen name="Select_user" component={SelectUser} />
        </stackLoginAndRegister.Navigator>

    )

}
