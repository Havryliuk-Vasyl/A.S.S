import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const { onLogin, onRegister } = useAuth();

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Login</ThemedText>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.button} onPress={() => onLogin(email, password)}>
                <ThemedText style={styles.buttonText}>Login</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onRegister(email, password)}>
                <ThemedText style={styles.buttonText}>Register</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        width: '100%',
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1DB954',
        borderRadius: 8,
        color: '#fff',
    },
    button: {
        width: '100%',
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#1DB954',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Login;