import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackNavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Budget } from './src/screen/budget/Budget';
import { AllExpend } from './src/screen/AllExpend';
import { Icon } from '@rneui/base';

import DatabaseManager from './src/utils/DataBase';
import { Provider } from 'react-redux';
import { store } from './src/redux/appStore';
import { AddExpendBudget } from './src/screen/budget/AddExpendBudget';



export default function App() {

  DatabaseManager.initializeDatabase();


  return (
    <Provider store={store}>
      <NavigationContainer>
        <TabButton />
      </NavigationContainer>
    </Provider>
  );
}

const Tab = createBottomTabNavigator();


export const TabButton = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e91e63',
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen name="Budget"
        options={
          {
            tabBarLabel: 'Tous les budgets',
            tabBarIcon: ({ color, size }) => (
              <Icon name="dollar" type='font-awesome' color={color} size={size} />
            ),
          }
        }
        component={StackBudget} />
      <Tab.Screen name="addExpend"
        options={
          {
            tabBarLabel: 'Toutes les dépenses',
            tabBarIcon: ({ color, size }) => (
              <Icon name="money" type='font-awesome' color={color} size={size} />
            ),
          }
        }
        component={AllExpend} />
    </Tab.Navigator>
  );
}


const stackBudget = createStackNavigator();

export const StackBudget = () => {
  return (
    <stackBudget.Navigator
      screenOptions={{
        headerShown: false,

      }}
    >
      <stackBudget.Screen name="Budget2" component={Budget} />
      <stackBudget.Screen name="AddExpendBudget" component={AddExpendBudget} />
    </stackBudget.Navigator>
  );
}




