import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import Login from './Login';

const Stack = createNativeStackNavigator();

const App = () => {

    return (
        <AuthProvider>
            <Layout />
        </AuthProvider>   
    );
};

export const Layout = () => {
    const { authState, onLogout } = useAuth();

    if (authState === undefined) {
        return <LoadingScreen/>
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
            { authState?.authenticated ? (
                <Stack.Screen name="Home" component={Home} />
            ) : (
                <Stack.Screen name="Login" component={Login} />
            )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
);
  

export default App;