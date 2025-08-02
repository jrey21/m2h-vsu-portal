import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';

interface NavigationProps {
    activeTab: string;
    onTabPress: (tab: string) => void;
    userRole?: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabPress, userRole }) => {
    const allTabs = [
        { id: 'Home', label: 'Home', icon: 'home' },
        { id: 'Reports', label: 'Reports', icon: 'assessment' },
        { id: 'Profile', label: 'Profile', icon: 'person' },
    ];

    // Filter out Reports tab if user is an occupant
    const tabs = userRole === 'occupant'
        ? allTabs.filter(tab => tab.id !== 'Reports')
        : allTabs;

    // If activeTab is Reports and user is occupant, switch to Home
    React.useEffect(() => {
        if (activeTab === 'Reports' && userRole === 'occupant') {
            onTabPress('Home');
        }
    }, [activeTab, userRole, onTabPress]);

    return (
        <View style={styles.tabBar}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={[styles.tabItem, activeTab === tab.id && styles.activeTab]}
                    onPress={() => onTabPress(tab.id)}
                >
                    <Icon
                        name={tab.icon}
                        type="material"
                        size={24}
                        color={activeTab === tab.id ? '#007AFF' : '#666'}
                    />
                    <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingVertical: 8,
        paddingBottom: 20,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    activeTab: {
        backgroundColor: 'transparent',
    },
    tabLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    activeTabLabel: {
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default Navigation;
