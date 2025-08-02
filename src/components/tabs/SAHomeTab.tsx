import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { Session } from '@supabase/supabase-js';
import { Icon } from '@rneui/themed';
import {
    fetchUserWithDetailsSimple,
    fetchEnhancedBalance,
    fetchUserViolationsSimple,
    fetchCleaningAbsences,
    UserData,
    EnhancedBalanceData,
    ViolationData,
    CleaningAbsenceData,
} from '../../lib/dataService';

interface HomeTabProps {
    session: Session;
}

const SAHomeTab: React.FC<HomeTabProps> = ({ session }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [balanceData, setBalanceData] = useState<EnhancedBalanceData | null>(null);
    const [violations, setViolations] = useState<ViolationData[]>([]);
    const [absences, setAbsences] = useState<CleaningAbsenceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAllViolations, setShowAllViolations] = useState(false);
    const [showAllAbsences, setShowAllAbsences] = useState(false);

    const getCurrentDate = () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getGreeting = () => {
        const now = new Date();
        const hour = now.getHours();

        if (hour >= 5 && hour < 12) {
            return 'Good Morning';
        } else if (hour >= 12 && hour < 17) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const user = await fetchUserWithDetailsSimple();
            setUserData(user);

            if (user) {
                const balance = await fetchEnhancedBalance(user.id);
                setBalanceData(balance);

                const userViolations = await fetchUserViolationsSimple(user.id);
                setViolations(userViolations);

                const userAbsences = await fetchCleaningAbsences(user.id);
                setAbsences(userAbsences);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#059669" />
                <Text style={styles.loadingText}>Loading your dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.tabContent}>

                {/* Welcome Header */}
                <View style={styles.welcomeHeader}>
                    <View style={styles.welcomeContent}>
                        <Text style={styles.greeting}>
                            {getGreeting()},
                        </Text>
                        <Text style={styles.userName}>
                            {userData?.occupant.first_name || 'Resident'}!
                        </Text>
                        <Text style={styles.date}>{getCurrentDate()}</Text>
                    </View>
                    <View style={styles.decorativeElement}>
                        <View style={styles.decorativeCircle} />
                        <View style={styles.decorativeCircleSmall} />
                    </View>
                </View>

                {/* Room Info */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icon
                            name="home"
                            type="font-awesome"
                            size={20}
                            color="#059669"
                            style={styles.homeIcon}
                        />
                        <Text style={styles.cardTitle}>Your Room</Text>
                    </View>
                    <Text style={styles.roomNumber}>{userData?.room.room_name}</Text>
                    <Text style={styles.roomDetails}>{userData?.room.level}</Text>
                    <Text style={styles.roomAssigned}>
                        Assigned since: {userData?.school_year_admitted.school_year.semester} - {userData?.school_year_admitted.school_year.year}
                    </Text>
                    <Text style={[styles.statusBadge, styles.activeBadge]}>Active</Text>
                </View>

                {/* Balance Summary */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icon
                            name="credit-card"
                            type="font-awesome"
                            size={20}
                            color="#059669"
                            style={styles.homeIcon}
                        />
                        <Text style={styles.cardTitle}>Balance Summary</Text>
                    </View>
                    <Text style={styles.balanceAmount}>
                        ₱{balanceData?.current_balance?.toFixed(2) || '0.00'}
                    </Text>
                    <View style={styles.balanceRow}>
                        <Text style={styles.subtext}>Monthly Payments:</Text>
                        <Text style={styles.subtextAmount}>₱ {balanceData?.monthly_payment_amount?.toFixed(2) || '0.00'}</Text>
                    </View>
                    <View style={styles.balanceRow}>
                        <Text style={styles.subtext}>Unpaid Violations:</Text>
                        <Text style={styles.subtextAmount}>₱ {balanceData?.total_fines?.toFixed(2) || '0.00'}</Text>
                    </View>
                    <View style={styles.balanceRow}>
                        <Text style={styles.subtext}>Previous Credit:</Text>
                        <Text style={styles.subtextAmount}>₱ {balanceData?.total_paid?.toFixed(2) || '0.00'}</Text>
                    </View>
                </View>

                {/* Recent Violations */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icon
                            name="exclamation-triangle"
                            type="font-awesome"
                            size={20}
                            color="#059669"
                            style={styles.homeIcon}
                        />
                        <Text style={styles.cardTitle}>Recent Violations</Text>
                        {violations.length > 3 && (
                            <TouchableOpacity
                                onPress={() => setShowAllViolations(!showAllViolations)}
                                style={styles.viewAllButton}
                            >
                                <Text style={styles.viewAllText}>
                                    {showAllViolations ? 'Show Less' : 'View All'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {violations.length > 0 ? (
                        (showAllViolations ? violations : violations.slice(0, 3)).map((v) => (
                            <View key={v.id} style={styles.violationItem}>
                                <Text style={styles.violationType}>{v.type_of_violation}</Text>
                                <Text style={styles.violationDate}>
                                    {new Date(v.date).toLocaleDateString()}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noData}>No recent violations</Text>
                    )}
                </View>

                {/* Cleaning Absences */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icon
                            name="calendar-times-o"
                            type="font-awesome"
                            size={20}
                            color="#059669"
                            style={styles.homeIcon}
                        />
                        <Text style={styles.cardTitle}>Absences in Cleaning</Text>
                        {absences.length > 3 && (
                            <TouchableOpacity
                                onPress={() => setShowAllAbsences(!showAllAbsences)}
                                style={styles.viewAllButton}
                            >
                                <Text style={styles.viewAllText}>
                                    {showAllAbsences ? 'Show Less' : 'View All'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {absences.length > 0 ? (
                        (showAllAbsences ? absences : absences.slice(0, 3)).map((absence) => (
                            <View key={absence.id} style={styles.absenceItem}>
                                <Text style={styles.absenceDate}>
                                    {new Date(absence.date).toLocaleDateString()}
                                </Text>
                                <Text style={styles.absenceReason}>
                                    {absence.reason || 'No reason provided'}
                                </Text>
                                <Text style={styles.absenceFine}>
                                    Fine: ₱{absence.fine_amount.toFixed(2)}
                                </Text>
                                <Text
                                    style={[
                                        styles.badge,
                                        absence.excused ? styles.excused : styles.notExcused,
                                    ]}
                                >
                                    {absence.excused ? 'Excused' : 'Not Excused'}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noData}>No cleaning absences</Text>
                    )}
                </View>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    loadingContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc',
    },
    loadingText: {
        marginTop: 16, fontSize: 17, color: '#64748b', fontWeight: '500',
    },
    tabContent: {
        flex: 1, padding: 20, paddingBottom: 40,
    },
    welcomeHeader: {
        backgroundColor: '#059669',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        marginHorizontal: -4,
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 8,
        position: 'relative',
        overflow: 'hidden',
    },
    welcomeContent: {
        zIndex: 2,
    },
    greeting: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        opacity: 0.9,
        marginBottom: 4,
    },
    userName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    date: {
        fontSize: 14,
        color: '#ffffff',
        opacity: 0.8,
        fontWeight: '500',
    },
    decorativeElement: {
        position: 'absolute',
        top: -30,
        right: -30,
        zIndex: 1,
    },
    decorativeCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ffffff',
        opacity: 0.1,
    },
    decorativeCircleSmall: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        opacity: 0.15,
        position: 'absolute',
        top: 40,
        right: 40,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardTitle: {
        fontSize: 18, fontWeight: '700', color: '#111827',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    homeIcon: {
        marginRight: 8,
    },
    viewAllButton: {
        marginLeft: 'auto',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#f0f9ff',
        borderWidth: 1,
        borderColor: '#059669',
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
    },
    roomNumber: { fontSize: 18, fontWeight: '600', color: '#1e293b' },
    roomDetails: { fontSize: 14, color: '#6b7280' },
    roomAssigned: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginTop: 8,
        fontSize: 13,
        fontWeight: '600',
    },
    activeBadge: {
        backgroundColor: '#d1fae5',
        color: '#059669',
    },
    balanceAmount: {
        fontSize: 24, fontWeight: '700', color: '#10b981', marginBottom: 8,
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    subtext: {
        fontSize: 14, color: '#6b7280',
    },
    subtextAmount: {
        fontSize: 14, color: '#6b7280', fontWeight: '600',
    },
    violationItem: {
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 10,
        marginTop: 10,
    },
    violationType: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
    violationDate: { fontSize: 13, color: '#6b7280' },
    badge: {
        alignSelf: 'flex-start',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 6,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 6,
    },
    paid: { backgroundColor: '#d1fae5', color: '#059669' },
    unpaid: { backgroundColor: '#fee2e2', color: '#dc2626' },
    noData: {
        fontSize: 14, color: '#9ca3af', fontStyle: 'italic', textAlign: 'center',
    },
    absenceItem: {
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 10,
        marginTop: 10,
    },
    absenceDate: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    absenceReason: {
        fontSize: 14,
        color: '#6b7280',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    absenceFine: {
        fontSize: 14,
        fontWeight: '600',
        color: '#dc2626',
        backgroundColor: '#fee2e2',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 6,
    },
    excused: {
        backgroundColor: '#d1fae5',
        color: '#059669',
    },
    notExcused: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
    },
});

export default SAHomeTab;
