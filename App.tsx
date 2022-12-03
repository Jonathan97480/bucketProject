import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Budget } from './src/screen/Budget';
import { AddExpend } from './src/screen/AddExpend';
import { Icon } from '@rneui/base';

import DatabaseManager from './src/utils/DataBase';
import { Provider } from 'react-redux';
import { store } from './src/redux/appStore';



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
            tabBarLabel: 'Budget',
            tabBarIcon: ({ color, size }) => (
              <Icon name="dollar" type='font-awesome' color={color} size={size} />
            ),
          }
        }
        component={Budget} />
      <Tab.Screen name="addExpend"
        options={
          {
            tabBarLabel: 'Ajoute une dépense',
            tabBarIcon: ({ color, size }) => (
              <Icon name="money" type='font-awesome' color={color} size={size} />
            ),
          }
        }
        component={AddExpend} />
    </Tab.Navigator>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
