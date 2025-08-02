import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, SafeAreaView, Platform } from 'react-native'
import { Session } from '@supabase/supabase-js'
import Navigation from './Navigation'
import { HomeTab, ReportsTab, ProfileTab } from './tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fetchUserWithDetailsSimple, UserData } from '../lib/dataService'
import React from 'react'

export default function Account({ session }: { session: Session }) {
    const [loading, setLoading] = useState(true)
    const [firstName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [lastName, setLastName] = useState('')
    const [suffix, setSuffix] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [address, setAddress] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [activeTab, setActiveTab] = useState('Home')
    const [userRole, setUserRole] = useState<string>('')

    const insets = useSafeAreaInsets()

    useEffect(() => {
        if (session) {
            getProfile()
            fetchUserRole()
        }
    }, [session])

    async function fetchUserRole() {
        try {
            const userData = await fetchUserWithDetailsSimple()
            if (userData) {
                setUserRole(userData.role)
            }
        } catch (error) {
            console.error('Error fetching user role:', error)
            // Default to 'occupant' if there's an error
            setUserRole('occupant')
        }
    }

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const { data, error, status } = await supabase
                .from('users')
                .select(`first_name, middle_name, last_name, suffix, contact_number, address, birthdate, avatar_url`)
                .eq('id', session?.user.id)
                .single()
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setFirstName(data.first_name || '')
                setMiddleName(data.middle_name || '')
                setLastName(data.last_name || '')
                setSuffix(data.suffix || '')
                setContactNumber(data.contact_number || '')
                setAddress(data.address || '')
                setBirthdate(data.birthdate || '')
                setAvatarUrl(data.avatar_url || '')
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({
        firstName,
        middleName,
        lastName,
        suffix,
        contactNumber,
        address,
        birthdate,
        avatar_url,
    }: {
        firstName: string
        middleName: string
        lastName: string
        suffix: string
        contactNumber: string
        address: string
        birthdate: string
        avatar_url: string
    }) {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const updates = {
                id: session?.user.id,
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                suffix,
                contact_number: contactNumber,
                address,
                birthdate,
                avatar_url,
                updated_at: new Date(),
            }

            const { error } = await supabase.from('users').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const renderHomeContent = () => <HomeTab session={session} />

    const renderReportsContent = () => <ReportsTab />

    const renderProfileContent = () => (
        <ProfileTab
            session={session}
            firstName={firstName}
            middleName={middleName}
            lastName={lastName}
            suffix={suffix}
            contactNumber={contactNumber}
            address={address}
            birthdate={birthdate}
            avatarUrl={avatarUrl}
            loading={loading}
            onUpdateProfile={updateProfile}
        />
    )

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Home':
                return renderHomeContent()
            case 'Reports':
                // Don't render Reports tab if user is an occupant
                return userRole === 'occupant' ? renderHomeContent() : renderReportsContent()
            case 'Profile':
                return renderProfileContent()
            default:
                return renderHomeContent()
        }
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <View style={styles.content}>
                    {renderTabContent()}
                </View>
                <View style={[styles.navigationWrapper, { paddingBottom: insets.bottom || 16 }]}>
                    <Navigation
                        activeTab={activeTab}
                        onTabPress={setActiveTab}
                        userRole={userRole}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    navigationWrapper: {
        backgroundColor: '#fff',
    },
})
