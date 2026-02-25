import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { RewardsService, UserStats } from '@/services/RewardsService';
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

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

    if (loading) return <ActivityIndicator color={Colors.light.tint} style={{ margin: 20 }} />;

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
        color: '#0F172A',
        marginBottom: 15,
    },
    leaderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
        elevation: 1,
    },
    rankContainer: {
        width: 30,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    rankText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94A3B8',
    },
    userInfo: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: 'transparent',
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    trustLevel: {
        fontSize: 12,
        color: '#64748B',
    },
    xpInfo: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    xpText: {
        fontSize: 12,
        fontWeight: '800',
        color: Colors.light.tint,
    }
});
