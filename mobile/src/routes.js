import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Image, View, TouchableOpacity } from 'react-native';

import Feed from './pages/Feed';
import New from './pages/New';

import logo from './assets/logo.png';
import camera from './assets/camera.png';

const Stack = createStackNavigator();

const Routes = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        title: <Image style={{ marginHorizontal: 20 }} source={logo} />,
        headerBackTitle: null,
        headerTintColor: '#000',
        presentation: 'modal',
      }}
      initialRouteName="Feed">
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('New')}>
                <Image source={camera} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="New"
        component={New}
        options={{
          title: 'Nova publicação',
        }}
      />
    </Stack.Navigator>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
};
