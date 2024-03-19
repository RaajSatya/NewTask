import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';
import Details from '../pages/Details';

export default function MainRouter() {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                statusBarTranslucent: true,
                statusBarColor: 'transparent'
            }} initialRouteName='Home'>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Details" component={Details} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}