
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Budget } from './src/screen/budget/Budget';
import { AllList } from './src/screen/AllList/AllList';
import { Icon } from '@rneui/base';

import DatabaseManager from './src/utils/DataBase';
import { Provider } from 'react-redux';
import { store } from './src/redux/appStore';
import { AddExpendBudget } from './src/screen/budget/AddExpendBudget';
import AllComptes from './src/screen/AllCompte/AllComptes';
import Compte from './src/screen/Compte/Compte';
import LoginAndRegister from './src/screen/LoginAndRegister/LoginAnRegister';

const Tab = createBottomTabNavigator();
const stackBudget = createNativeStackNavigator();

export default function App() {

  DatabaseManager.initializeDatabase();


  return (
    <Provider store={store}>
      <NavigationContainer>
        <stackBudget.Navigator
          initialRouteName='LoginAndRegister'
          screenOptions={{
            headerShown: false,

          }}
        >
          <stackBudget.Screen name="LoginAndRegister" component={LoginAndRegister} />
          <stackBudget.Screen name="Tab" component={TabButton} />
          <stackBudget.Screen name="AddExpendBudget" component={AddExpendBudget} />
          <stackBudget.Screen name="AllComptes" component={AllComptes} />


        </stackBudget.Navigator>
      </NavigationContainer>
    </Provider>
  );
}



export const TabButton = () => {
  return (
    <Tab.Navigator
      initialRouteName='compte'
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e91e63',
        tabBarStyle: { backgroundColor: '#fff' },

      }}
    >

      <Tab.Screen name="compte"

        options={
          {
            tabBarLabel: 'Votre compte',
            tabBarIcon: ({ color, size }) => (
              <Icon name="account-balance-wallet" color={color} size={size} />
            ),
          }
        }
        component={Compte} />
      <Tab.Screen name="Budget"

        options={
          {
            tabBarLabel: 'Tous les budgets',
            tabBarIcon: ({ color, size }) => (
              <Icon name="dollar" type='font-awesome' color={color} size={size} />
            ),
          }
        }
        component={Budget} />
      <Tab.Screen name="AllList"

        options={
          {
            tabBarLabel: 'Mes listes',
            tabBarIcon: ({ color, size }) => (
              <Icon name="list" type='font-awesome' color={color} size={size} />
            ),
          }
        }
        component={AllList} />
    </Tab.Navigator>
  );
}









