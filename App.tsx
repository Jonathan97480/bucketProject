
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Transaction } from './src/screen/Transaction/Transaction';
import { AllList } from './src/screen/AllList/AllList';
import DatabaseManager from './src/utils/DataBase';
import { Provider } from 'react-redux';
import { store } from './src/redux/appStore';
import { AddOperationInTheBudget } from './src/screen/AddOperationInTheBudget/AddOperationInTheBudget';
import AllComptes from './src/screen/AllCompte/AllComptes';
import Compte from './src/screen/Compte/Compte';
import LoginAndRegister from './src/screen/LoginAndRegister/LoginAnRegister';
import React from 'react';
import { TabBardCustom } from './src/components';

const Tab = createBottomTabNavigator();
const stackBudget = createNativeStackNavigator();


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#282525'
  },
};

export default function App() {

  DatabaseManager.initializeDatabase();


  return (
    <Provider store={store}>
      <NavigationContainer
        theme={MyTheme}
      >
        <stackBudget.Navigator
          initialRouteName='LoginAndRegister'
          screenOptions={{
            headerShown: false,


          }}
        >
          <stackBudget.Screen name="LoginAndRegister" component={LoginAndRegister} />
          <stackBudget.Screen name="Tab" component={TabButton} />
          <stackBudget.Screen name="AddExpendBudget" component={AddOperationInTheBudget} />
          <stackBudget.Screen name="AllComptes" component={AllComptes} />


        </stackBudget.Navigator>
      </NavigationContainer>
    </Provider>
  );
}



export const TabButton = () => {
  return (
    <Tab.Navigator
      initialRouteName='Account'

      tabBar={props => <TabBardCustom {...props} />}
      screenOptions={{
        headerShown: false,


      }}
    >

      <Tab.Screen name="Account" component={Compte} />
      <Tab.Screen name="transactions" component={Transaction} />
      <Tab.Screen name="List" component={AllList} />
    </Tab.Navigator>
  );
}









