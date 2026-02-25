import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { RewardsService, UserStats } from '@/services/RewardsService';
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

const theme = Colors.light;

export default function Leaderboard() {
    const [leaders, setLeaders] = useState<UserStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            const data = await RewardsService.getLeaderboard();
            setLeaders(data);
            setLoading(false);
        };
        fetchLeaders();
    }, []);

    if (loading) return <ActivityIndicator color={theme.tint} style={{ margin: 20 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Top Guardians</Text>
            {leaders.map((item, index) => (
                <View key={item.userId} style={styles.leaderCard}>
                    <View style={styles.rankContainer}>
                        {index < 3 ? (
                            <FontAwesome5
                                name="crown"
                                size={14}
                                color={index === 0 ? '#FDBA74' : index === 1 ? '#94A3B8' : '#D97706'}
                            />
                        ) : (
                            <Text style={styles.rankText}>{index + 1}</Text>
                        )}
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{item.userId.split('_')[1] || item.userId}</Text>
                        <Text style={styles.trustLevel}>{item.trustLevel || 'Reliable'}</Text>
                    </View>
                    <View style={styles.xpInfo}>
                        <Text style={styles.xpText}>{item.xp} XP</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.text,
        marginBottom: 15,
    },
    leaderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.card,
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.border,
    },
    rankContainer: {
        width: 30,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    rankText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.textSecondary,
    },
    userInfo: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: 'transparent',
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.text,
    },
    trustLevel: {
        fontSize: 12,
        color: theme.textSecondary,
    },
    xpInfo: {
        backgroundColor: theme.subtle,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.border,
    },
    xpText: {
        fontSize: 12,
        fontWeight: '800',
        color: theme.tint,
    }
});
