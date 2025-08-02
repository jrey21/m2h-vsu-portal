import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';

const ReportsTab: React.FC = () => {
    const reports = [
        {
            id: 1,
            title: 'Academic Performance',
            description: 'Current semester GPA and course grades',
            icon: 'school',
            color: '#4CAF50',
        },
        {
            id: 2,
            title: 'Attendance Report',
            description: 'Class attendance summary',
            icon: 'calendar-today',
            color: '#2196F3',
        },
        {
            id: 3,
            title: 'Assignment Status',
            description: 'Track your submitted and pending assignments',
            icon: 'assignment',
            color: '#FF9800',
        },
        {
            id: 4,
            title: 'Exam Schedule',
            description: 'Upcoming exams and test dates',
            icon: 'event',
            color: '#9C27B0',
        },
    ];

    return (
        <ScrollView style={styles.tabContent}>
            <Text style={styles.headerText}>Reports</Text>
            <Text style={styles.contentText}>View your academic reports and performance metrics.</Text>

            <View style={styles.reportsGrid}>
                {reports.map((report) => (
                    <TouchableOpacity key={report.id} style={styles.reportItem}>
                        <View style={[styles.reportIcon, { backgroundColor: report.color }]}>
                            <Icon
                                name={report.icon}
                                type="material"
                                size={24}
                                color="#fff"
                            />
                        </View>
                        <View style={styles.reportContent}>
                            <Text style={styles.reportTitle}>{report.title}</Text>
                            <Text style={styles.reportDescription}>{report.description}</Text>
                        </View>
                        <Icon
                            name="chevron-right"
                            type="material"
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Quick Stats</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>3.8</Text>
                        <Text style={styles.statLabel}>Current GPA</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>85%</Text>
                        <Text style={styles.statLabel}>Attendance</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Assignments</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        padding: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    contentText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    reportsGrid: {
        marginBottom: 30,
    },
    reportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    reportIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    reportContent: {
        flex: 1,
    },
    reportTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    reportDescription: {
        fontSize: 14,
        color: '#666',
    },
    statsSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default ReportsTab;
