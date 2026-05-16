import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import FeedScreen from './src/screens/FeedScreen';
import ItemDetailScreen from './src/screens/ItemDetailScreen';
import DoarScreen from './src/screens/DoarScreen';
import MeusAnunciosScreen from './src/screens/MeusAnunciosScreen';
import EditarAnuncioScreen from './src/screens/EditarAnuncioScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: '#1B4332' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

function FeedStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="FeedList" component={FeedScreen} options={{ title: 'Itens Disponíveis' }} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ title: 'Detalhes da Doação' }} />
    </Stack.Navigator>
  );
}

function MeusAnunciosStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="MeusAnunciosList" component={MeusAnunciosScreen} options={{ title: 'Meus Anúncios' }} />
      <Stack.Screen name="EditarAnuncio" component={EditarAnuncioScreen} options={{ title: 'Editar Anúncio' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      {/* ✅ backgroundColor igual ao header, translucent false */}
      <StatusBar style="light" backgroundColor="#1B4332" translucent={false} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Feed') iconName = focused ? 'heart' : 'heart-outline';
              else if (route.name === 'Doar') iconName = focused ? 'add-circle' : 'add-circle-outline';
              else if (route.name === 'MeusAnuncios') iconName = focused ? 'person' : 'person-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#40916C',
            tabBarInactiveTintColor: '#aaa',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopColor: '#e0e0e0',
              height: Platform.OS === 'ios' ? 85 : 65,
              paddingBottom: Platform.OS === 'ios' ? 25 : 8,
              paddingTop: 5,
            },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Feed" component={FeedStack} options={{ tabBarLabel: 'Doações' }} />
          <Tab.Screen
            name="Doar"
            component={DoarScreen}
            options={{
              tabBarLabel: 'Doar Item',
              headerShown: true,
              headerTitle: 'Cadastrar Doação',
              ...headerOptions,
            }}
          />
          <Tab.Screen name="MeusAnuncios" component={MeusAnunciosStack} options={{ tabBarLabel: 'Meus Anúncios' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}