import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, Modal } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Icon } from '@rneui/base';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

interface ProfileTabProps {
    session: Session;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    contactNumber: string;
    address: string;
    birthdate: string;
    avatarUrl: string;
    loading: boolean;
    onUpdateProfile: (profile: {
        firstName: string;
        middleName: string;
        lastName: string;
        suffix: string;
        contactNumber: string;
        address: string;
        birthdate: string;
        avatar_url: string;
    }) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
    session,
    firstName,
    middleName,
    lastName,
    suffix,
    contactNumber,
    address,
    birthdate,
    avatarUrl,
    loading,
    onUpdateProfile,
}) => {
    const [editMode, setEditMode] = useState(false);
    const [tempFirstName, setTempFirstName] = useState(firstName);
    const [tempMiddleName, setTempMiddleName] = useState(middleName);
    const [tempLastName, setTempLastName] = useState(lastName);
    const [tempSuffix, setTempSuffix] = useState(suffix);
    const [tempContactNumber, setTempContactNumber] = useState(contactNumber);
    const [tempAddress, setTempAddress] = useState(address);
    const [tempBirthdate, setTempBirthdate] = useState(birthdate);
    const [showSuffixPicker, setShowSuffixPicker] = useState(false);

    const suffixOptions = ['', 'Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

    const handleSuffixSelect = (selectedSuffix: string) => {
        setTempSuffix(selectedSuffix);
        setShowSuffixPicker(false);
    };

    const handleSave = () => {
        onUpdateProfile({
            firstName: tempFirstName,
            middleName: tempMiddleName,
            lastName: tempLastName,
            suffix: tempSuffix,
            contactNumber: tempContactNumber,
            address: tempAddress,
            birthdate: tempBirthdate,
            avatar_url: avatarUrl,
        });
        setEditMode(false);
    };

    const handleCancel = () => {
        setTempFirstName(firstName);
        setTempMiddleName(middleName);
        setTempLastName(lastName);
        setTempSuffix(suffix);
        setTempContactNumber(contactNumber);
        setTempAddress(address);
        setTempBirthdate(birthdate);
        setEditMode(false);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Profile</Text>
                <Text style={styles.headerSubtitle}>Manage your account settings</Text>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarPlaceholder}>
                            <Icon
                                name="person"
                                type="material"
                                size={50}
                                color="#007AFF"
                            />
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Icon
                                name="camera-alt"
                                type="material"
                                size={14}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{`${firstName} ${lastName}` || 'User'}</Text>
                        <Text style={styles.userEmail}>{session?.user.email}</Text>
                    </View>
                </View>
            </View>

            {/* Profile Details Card */}
            <View style={styles.detailsCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Personal Information</Text>
                    {!editMode && (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setEditMode(true)}
                        >
                            <Icon
                                name="edit"
                                type="material"
                                size={18}
                                color="#007AFF"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {editMode ? (
                    <View style={styles.editForm}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>First Name</Text>
                            <Input
                                value={tempFirstName}
                                onChangeText={setTempFirstName}
                                placeholder="Enter first name"
                                containerStyle={styles.inputContainer}
                                inputContainerStyle={styles.inputField}
                                inputStyle={styles.inputText}
                                leftIcon={{
                                    type: 'material',
                                    name: 'person-outline',
                                    color: '#666',
                                    size: 20,
                                }}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Middle Name</Text>
                            <Input
                                value={tempMiddleName}
                                onChangeText={setTempMiddleName}
                                placeholder="Enter middle name"
                                containerStyle={styles.inputContainer}
                                inputContainerStyle={styles.inputField}
                                inputStyle={styles.inputText}
                                leftIcon={{
                                    type: 'material',
                                    name: 'person-outline',
                                    color: '#666',
                                    size: 20,
                                }}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Last Name</Text>
                            <Input
                                value={tempLastName}
                                onChangeText={setTempLastName}
                                placeholder="Enter last name"
                                containerStyle={styles.inputContainer}
                                inputContainerStyle={styles.inputField}
                                inputStyle={styles.inputText}
                                leftIcon={{
                                    type: 'material',
                                    name: 'person-outline',
                                    color: '#666',
                                    size: 20,
                                }}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Suffix</Text>
                            <TouchableOpacity
                                style={styles.dropdownContainer}
                                onPress={() => setShowSuffixPicker(true)}
                            >
                                <View style={styles.dropdownContent}>
                                    <Icon
                                        name="badge"
                                        type="material"
                                        size={20}
                                        color="#666"
                                        style={styles.dropdownIcon}
                                    />
                                    <Text style={[styles.dropdownText, !tempSuffix && styles.placeholderText]}>
                                        {tempSuffix || 'Select suffix (optional)'}
                                    </Text>
                                    <Icon
                                        name="arrow-drop-down"
                                        type="material"
                                        size={24}
                                        color="#666"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Contact Number</Text>
                            <Input
                                value={tempContactNumber}
                                onChangeText={setTempContactNumber}
                                placeholder="Enter contact number"
                                containerStyle={styles.inputContainer}
                                inputContainerStyle={styles.inputField}
                                inputStyle={styles.inputText}
                                keyboardType="phone-pad"
                                leftIcon={{
                                    type: 'material',
                                    name: 'phone',
                                    color: '#666',
                                    size: 20,
                                }}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Address</Text>
                            <Input
                                value={tempAddress}
                                onChangeText={setTempAddress}
                                placeholder="Enter address"
                                containerStyle={styles.inputContainer}
                                inputContainerStyle={styles.inputField}
                                inputStyle={styles.inputText}
                                multiline
                                numberOfLines={3}
                                leftIcon={{
                                    type: 'material',
                                    name: 'location-on',
                                    color: '#666',
                                    size: 20,
                                }}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Birthdate</Text>
                            <Input
                                value={tempBirthdate}
                                onChangeText={setTempBirthdate}
                                placeholder="MM/DD/YYYY"
                                containerStyle={styles.inputContainer}
                                inputContainerStyle={styles.inputField}
                                inputStyle={styles.inputText}
                                leftIcon={{
                                    type: 'material',
                                    name: 'cake',
                                    color: '#666',
                                    size: 20,
                                }}
                            />
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancel}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                                disabled={loading}
                            >
                                <Text style={styles.saveButtonText}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.profileFields}>
                        <View style={styles.fieldRow}>
                            <View style={styles.fieldIcon}>
                                <Icon name="person-outline" type="material" size={20} color="#666" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>First Name</Text>
                                <Text style={styles.fieldValue}>{firstName || 'Not set'}</Text>
                            </View>
                        </View>
                        <View style={styles.fieldRow}>
                            <View style={styles.fieldIcon}>
                                <Icon name="person-outline" type="material" size={20} color="#666" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>Middle Name</Text>
                                <Text style={styles.fieldValue}>{middleName || 'Not set'}</Text>
                            </View>
                        </View>
                        <View style={styles.fieldRow}>
                            <View style={styles.fieldIcon}>
                                <Icon name="person-outline" type="material" size={20} color="#666" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>Last Name</Text>
                                <Text style={styles.fieldValue}>{lastName || 'Not set'}</Text>
                            </View>
                        </View>
                        <View style={styles.fieldRow}>
                            <View style={styles.fieldIcon}>
                                <Icon name="badge" type="material" size={20} color="#666" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>Suffix</Text>
                                <Text style={styles.fieldValue}>{suffix || 'Not set'}</Text>
                            </View>
                        </View>
                        <View style={styles.fieldRow}>
                            <View style={styles.fieldIcon}>
                                <Icon name="phone" type="material" size={20} color="#666" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>Contact Number</Text>
                                <Text style={styles.fieldValue}>{contactNumber || 'Not set'}</Text>
                            </View>
                        </View>
                        <View style={styles.fieldRow}>
                            <View style={styles.fieldIcon}>
                                <Icon name="location-on" type="material" size={20} color="#666" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>Address</Text>
                                <Text style={styles.fieldValue}>{address || 'Not set'}</Text>
                            </View>
                        </View>
                        <View style={styles.fieldRow}>
                            <View style={styles.fieldIcon}>
                                <Icon name="cake" type="material" size={20} color="#666" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>Birthdate</Text>
                                <Text style={styles.fieldValue}>{birthdate || 'Not set'}</Text>
                            </View>
                        </View>
                        <View style={styles.fieldRow}>
                            <View style={styles.fieldIcon}>
                                <Icon name="email" type="material" size={20} color="#666" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>Email</Text>
                                <Text style={styles.fieldValue}>{session?.user.email}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsCard}>
                <Text style={styles.cardTitle}>Quick Actions</Text>
                <View style={styles.actionsList}>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={styles.actionIcon}>
                            <Icon name="notifications" type="material" size={20} color="#007AFF" />
                        </View>
                        <Text style={styles.actionText}>Notifications</Text>
                        <Icon name="chevron-right" type="material" size={20} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={styles.actionIcon}>
                            <Icon name="security" type="material" size={20} color="#007AFF" />
                        </View>
                        <Text style={styles.actionText}>Privacy & Security</Text>
                        <Icon name="chevron-right" type="material" size={20} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={styles.actionIcon}>
                            <Icon name="help" type="material" size={20} color="#007AFF" />
                        </View>
                        <Text style={styles.actionText}>Help & Support</Text>
                        <Icon name="chevron-right" type="material" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sign Out Button */}
            <View style={styles.signOutSection}>
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={() => supabase.auth.signOut()}
                >
                    <Icon name="logout" type="material" size={18} color="#fff" />
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            {/* Suffix Picker Modal */}
            <Modal
                visible={showSuffixPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSuffixPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Suffix</Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowSuffixPicker(false)}
                            >
                                <Icon name="close" type="material" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.optionsList}>
                            {suffixOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionItem,
                                        tempSuffix === option && styles.selectedOption
                                    ]}
                                    onPress={() => handleSuffixSelect(option)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        tempSuffix === option && styles.selectedOptionText
                                    ]}>
                                        {option || 'None'}
                                    </Text>
                                    {tempSuffix === option && (
                                        <Icon name="check" type="material" size={20} color="#007AFF" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerSection: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        opacity: 0.8,
    },
    profileCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: 16,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f6ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#e3f2fd',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#007AFF',
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
        opacity: 0.8,
    },
    detailsCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    editButton: {
        backgroundColor: '#f0f6ff',
        borderRadius: 20,
        padding: 8,
    },
    profileFields: {
        gap: 16,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    fieldIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    fieldContent: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
        fontWeight: '500',
    },
    fieldValue: {
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    editForm: {
        gap: 16,
    },
    inputGroup: {
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    inputContainer: {
        paddingHorizontal: 0,
        marginBottom: 0,
    },
    inputField: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderBottomWidth: 0,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    inputText: {
        fontSize: 16,
        color: '#1a1a1a',
        marginLeft: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    quickActionsCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    actionsList: {
        marginTop: 16,
        gap: 4,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    signOutSection: {
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 40,
    },
    signOutButton: {
        backgroundColor: '#ff3b30',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#ff3b30',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    signOutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    dropdownContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginHorizontal: 12,
        marginBottom: 12,
    },
    dropdownContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        minHeight: 56,
    },
    dropdownIcon: {
        marginRight: 12,
    },
    dropdownText: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
        marginLeft: 8,
    },
    placeholderText: {
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        margin: 20,
        width: width - 40,
        maxHeight: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    modalCloseButton: {
        padding: 4,
    },
    optionsList: {
        maxHeight: 300,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    selectedOption: {
        backgroundColor: '#f0f6ff',
    },
    optionText: {
        fontSize: 16,
        color: '#1a1a1a',
        flex: 1,
    },
    selectedOptionText: {
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default ProfileTab;
