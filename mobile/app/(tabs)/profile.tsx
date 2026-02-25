import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { RewardsService, UserStats } from '@/services/RewardsService';

const theme = Colors.light;

export default function ProfileScreen() {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await RewardsService.getUserStats('user_alex_123');
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatar}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80' }}
                            style={styles.avatarImg}
                        />
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>LVL {stats?.level || 1}</Text>
                        </View>
                    </View>
                    <Text style={styles.userName}>Alex Morgan</Text>
                    <View style={styles.trustRow}>
                        <MaterialIcons name="verified-user" size={16} color={theme.safe} />
                        <Text style={styles.trustText}>
                            {stats?.safetyScore && stats.safetyScore > 80 ? 'Verified Guardian' : 'Reliable Traveler'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{stats?.xp.toLocaleString() || 0}</Text>
                    <Text style={styles.statLabel}>Total XP</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{stats?.safetyScore || 50}</Text>
                    <Text style={styles.statLabel}>Safety Score</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{stats?.badges.length || 0}</Text>
                    <Text style={styles.statLabel}>Badges</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Badges</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
                    {stats?.badges.map((badge, index) => (
                        <View key={index} style={styles.badgeCard}>
                            <FontAwesome5
                                name={badge === 'Safety First' ? 'shield-alt' : badge === 'Explorer' ? 'map-marked-alt' : 'medal'}
                                size={32}
                                color={badge === 'Safety First' ? theme.safe : badge === 'Explorer' ? theme.tint : theme.cultural}
                            />
                            <Text style={styles.badgeName}>{badge}</Text>
                        </View>
                    ))}
                    {(!stats?.badges || stats.badges.length === 0) && (
                        <Text style={styles.emptyText}>Report scams or visit safe zones to earn badges!</Text>
                    )}
                </ScrollView>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="download-outline" size={24} color={theme.textSecondary} />
                    <Text style={styles.menuLabel}>Offline SafePacks</Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={24} color={theme.textSecondary} />
                    <Text style={styles.menuLabel}>Account Settings</Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-buoy-outline" size={24} color={theme.textSecondary} />
                    <Text style={styles.menuLabel}>Support Center</Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        backgroundColor: theme.card,
        paddingTop: 40,
        paddingBottom: 30,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    profileInfo: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    avatar: {
        position: 'relative',
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    avatarImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: theme.tint,
    },
    levelBadge: {
        position: 'absolute',
        bottom: -5,
        backgroundColor: theme.cultural,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.card,
        alignSelf: 'center',
    },
    levelText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.text,
        marginBottom: 4,
    },
    trustRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    trustText: {
        marginLeft: 6,
        fontSize: 14,
        color: theme.safe,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: theme.card,
        marginTop: 2,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.border,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.text,
    },
    statLabel: {
        fontSize: 12,
        color: theme.textSecondary,
        fontWeight: '600',
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: theme.border,
        alignSelf: 'center',
    },
    section: {
        marginTop: 30,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.text,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    badgeScroll: {
        paddingLeft: 20,
        backgroundColor: 'transparent',
    },
    badgeCard: {
        backgroundColor: theme.card,
        width: 100,
        padding: 15,
        borderRadius: 20,
        marginRight: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.border,
    },
    badgeName: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '700',
        color: theme.text,
        textAlign: 'center',
    },
    menu: {
        marginTop: 30,
        marginHorizontal: 20,
        backgroundColor: theme.card,
        borderRadius: 20,
        padding: 10,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: theme.border,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'transparent',
    },
    menuLabel: {
        flex: 1,
        marginLeft: 15,
        fontSize: 15,
        fontWeight: '600',
        color: theme.text,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
    },
    emptyText: {
        fontSize: 14,
        color: theme.textSecondary,
        fontStyle: 'italic',
        marginTop: 20,
        paddingRight: 40,
    }
});
