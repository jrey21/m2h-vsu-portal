import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions } from 'react-native';
import { supabase } from '../lib/supabase';
import { Button, Input, Icon } from '@rneui/themed';
import { AppState } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Auto refresh listener
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

interface AuthProps {
    onBackToHome?: () => void;
}

export default function Auth({ onBackToHome }: AuthProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    } return (<View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToHome}>
            <Icon name="arrow-back" type="material" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
            <Image source={require('../../assets/M2H-logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.appName}>Welcome Back!</Text>
            <Text style={styles.tagline}>Be a responsible occupant</Text>
        </View>

        <View style={styles.formContainer}>

            <Input
                placeholder="Email"
                leftIcon={{ type: 'material', name: 'email', color: '#000' }}
                onChangeText={setEmail}
                value={email}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
            />
            <Input
                placeholder="Password"
                leftIcon={{ type: 'material', name: 'lock', color: '#000' }}
                rightIcon={{
                    type: 'material',
                    name: showPassword ? 'visibility' : 'visibility-off',
                    color: '#000',
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={!showPassword}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
            />

            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotText}>Forgot your Password?</Text>
            </TouchableOpacity>

            <Button
                title={loading ? 'Logging in...' : 'Login'}
                onPress={signInWithEmail}
                disabled={loading}
                buttonStyle={styles.loginButton}
                titleStyle={styles.loginButtonText}
                loading={loading}
            />

            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>or continue with</Text>
                <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.googleButton}>
                <Image
                    source={require('../../assets/google-logo.png')}
                    style={styles.googleLogo}
                />
                <Text style={styles.googleButtonText}>Google Account</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text>Don’t have an account? </Text>
                <TouchableOpacity onPress={signUpWithEmail}>
                    <Text style={styles.signupText}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }, backButton: {
        position: 'absolute',
        top: 20,
        left: 15,
        zIndex: 1,
        padding: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    logo: {
        width: 125,
        height: 125,
        marginBottom: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#45c251',
    },
    tagline: {
        fontSize: 14,
        color: '#45c251',
        marginTop: 4,
        marginBottom: 10,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 30,
        marginTop: 20,
    },
    // signInTitle: {
    //     fontSize: 18,
    //     fontWeight: '600',
    //     marginBottom: 20,
    //     textAlign: 'center',
    // },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 2,
    },
    inputText: {
        fontSize: 16,
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginTop: 0,
        marginBottom: 18,
    },
    forgotText: {
        fontSize: 14,
        color: '#45c251',
    },
    loginButton: {
        backgroundColor: '#45c251',
        borderRadius: 6,
        paddingVertical: 12,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    orText: {
        marginHorizontal: 10,
        color: '#999',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderRadius: 6,
    },
    googleLogo: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleButtonText: {
        fontSize: 16,
        color: '#333',
    }, footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#45c251',
        fontWeight: 'bold',
    },
});
