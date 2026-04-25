import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import FeedScreen from './src/screens/FeedScreen';
import ItemDetailScreen from './src/screens/ItemDetailScreen';
import DoarScreen from './src/screens/DoarScreen';
import MeusAnunciosScreen from './src/screens/MeusAnunciosScreen';
import EditarAnuncioScreen from './src/screens/EditarAnuncioScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para o Feed (Feed + Detalhe)
function FeedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1B4332' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="FeedList"
        component={FeedScreen}
        options={{ title: 'Itens Disponíveis' }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: 'Detalhes da Doação' }}
      />
    </Stack.Navigator>
  );
}

// Stack para Meus Anúncios (Lista + Editar)
function MeusAnunciosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1B4332' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="MeusAnunciosList"
        component={MeusAnunciosScreen}
        options={{ title: 'Meus Anúncios' }}
      />
      <Stack.Screen
        name="EditarAnuncio"
        component={EditarAnuncioScreen}
        options={{ title: 'Editar Anúncio' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Feed') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Doar') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'MeusAnuncios') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#40916C',
          tabBarInactiveTintColor: '#aaa',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#e0e0e0',
            paddingBottom: 5,
            height: 60,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Feed"
          component={FeedStack}
          options={{ tabBarLabel: 'Doações' }}
        />
        <Tab.Screen
          name="Doar"
          component={DoarScreen}
          options={{
            tabBarLabel: 'Doar Item',
            headerShown: true,
            headerTitle: 'Cadastrar Doação',
            headerStyle: { backgroundColor: '#1B4332' },
            headerTintColor: '#fff',
          }}
        />
        <Tab.Screen
          name="MeusAnuncios"
          component={MeusAnunciosStack}
          options={{ tabBarLabel: 'Meus Anúncios' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
