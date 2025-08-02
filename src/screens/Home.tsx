import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Dimensions, Image, ActivityIndicator } from 'react-native'
import { Button } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient'

interface HomeProps {
    onNavigateToLogin: () => void
}

const { width, height } = Dimensions.get('window')

export default function Home({ onNavigateToLogin }: HomeProps) {
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(true)
            // After showing loading for 3 seconds, navigate to auth
            setTimeout(() => {
                onNavigateToLogin()
            }, 3000)
        }, 1000) // Start loading after 1 second

        return () => clearTimeout(timer)
    }, [onNavigateToLogin])
    return (
        <LinearGradient
            colors={['#4ade80', '#22c55e']}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.heroSection}>

                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Welcome to</Text>
                        <Text style={styles.titleText}>M2H Portal</Text>
                        <View style={styles.underline} />
                        <Text style={styles.subtitle}>Your fines matter during our happy hour</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#ffffff" />
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    ) : (
                        <Button
                            title="Get Started"
                            onPress={() => {
                                setIsLoading(true)
                                setTimeout(() => {
                                    onNavigateToLogin()
                                }, 3000)
                            }}
                            buttonStyle={styles.nextButton}
                            titleStyle={styles.buttonTitle}
                        />
                    )}
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
        width: 125,
        height: 125,
        marginBottom: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 60,
    },
    heroSection: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 2,
    },
    welcomeContainer: {
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: '300',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 5,
        letterSpacing: 1,
    },
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 10,
        letterSpacing: 1,
    },
    underline: {
        width: 60,
        height: 3,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        marginBottom: 15,
        opacity: 0.8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontWeight: '300',
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#ffffff',
        marginTop: 10,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    nextButton: {
        backgroundColor: '#ffffff',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        width: width * 0.8,
    },
    buttonTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#16a34a',
        letterSpacing: 0.5,
    },
    featureContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    featureItem: {
        marginVertical: 5,
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    featureText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
        textAlign: 'center',
    },
})