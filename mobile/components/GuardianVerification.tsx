import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { ScamService } from '@/services/ScamService';
import Colors from '@/constants/Colors';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Config from '@/constants/Config';

const theme = Colors.light;

export default function GuardianVerification() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        setLoading(true);
        const data = await ScamService.getPendingReports();
        setReports(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleVerify = async (id: string, isVerified: boolean) => {
        try {
            await ScamService.verifyReport(id, isVerified);
            Alert.alert("Success", isVerified ? "Report verified. User awarded XP." : "Report dismissed.");
            fetchPending();
        } catch (error) {
            Alert.alert("Error", "Could not complete verification.");
        }
    };

    if (loading && reports.length === 0) return <ActivityIndicator style={{ marginTop: 20 }} color={theme.tint} />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="shield-checkmark" size={24} color={theme.safe} />
                <Text style={styles.title}>Pending Verifications</Text>
            </View>

            {reports.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>All caught up! No pending reports.</Text>
                </View>
            ) : (
                <FlatList
                    data={reports}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.scamType}>{item.type || 'Unknown Scam'}</Text>
                                <View style={[styles.riskBadge, { backgroundColor: item.riskScore > 0.7 ? 'rgba(239,68,68,0.15)' : 'rgba(217,119,6,0.15)' }]}>
                                    <Text style={[styles.riskText, { color: item.riskScore > 0.7 ? '#EF4444' : '#D97706' }]}>
                                        AI Risk: {Math.round(item.riskScore * 100)}%
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.description}>{item.description}</Text>

                            {item.evidenceUrl && (
                                <Image
                                    source={{ uri: `${Config.API_URL}${item.evidenceUrl}` }}
                                    style={styles.evidenceImage}
                                />
                            )}

                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={[styles.button, styles.dismissButton]}
                                    onPress={() => handleVerify(item.id, false)}
                                >
                                    <Text style={styles.buttonTextDismiss}>Dismiss</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.verifyButton]}
                                    onPress={() => handleVerify(item.id, true)}
                                >
                                    <Text style={styles.buttonTextVerify}>Verify & Reward</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.text,
        marginLeft: 10,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: theme.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border,
    },
    emptyText: {
        color: theme.textSecondary,
        fontSize: 14,
    },
    card: {
        backgroundColor: theme.card,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: 'transparent',
    },
    scamType: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.text,
    },
    riskBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    riskText: {
        fontSize: 10,
        fontWeight: '800',
    },
    description: {
        fontSize: 14,
        color: theme.textSecondary,
        lineHeight: 20,
        marginBottom: 12,
    },
    evidenceImage: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        marginBottom: 15,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    button: {
        flex: 0.48,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    dismissButton: {
        borderWidth: 1,
        borderColor: theme.border,
    },
    verifyButton: {
        backgroundColor: theme.safe,
    },
    buttonTextDismiss: {
        color: theme.textSecondary,
        fontWeight: '700',
        fontSize: 13,
    },
    buttonTextVerify: {
        color: 'white',
        fontWeight: '700',
        fontSize: 13,
    }
});
