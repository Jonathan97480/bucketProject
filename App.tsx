import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Buget } from './src/screen/Buget';
import { AddDepense } from './src/screen/AddDepense';
import { Icon } from '@rneui/base';
import * as SQLite from 'expo-sqlite';
import DatabaseManager from './src/utils/DataBase';
const db = SQLite.openDatabase("database.db");


export default function App() {

  DatabaseManager.initializeDatabase();

  DatabaseManager.getCategory().then((result) => {
    /* TODO:implementation de redux */
  });

  return (
    <NavigationContainer>
      <TabButton />
    </NavigationContainer>
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
      <Tab.Screen name="Buget"
        options={
          {
            tabBarLabel: 'Buget',
            tabBarIcon: ({ color, size }) => (
              <Icon name="dollar" type='font-awesome' color={color} size={size} />
            ),
          }
        }
        component={Buget} />
      <Tab.Screen name="AddDepense"
        options={
          {
            tabBarLabel: 'Buget',
            tabBarIcon: ({ color, size }) => (
              <Icon name="money" type='font-awesome' color={color} size={size} />
            ),
          }
        }
        component={AddDepense} />
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
