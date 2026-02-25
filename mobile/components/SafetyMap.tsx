import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafetyService } from '@/services/SafetyService';
import { StorageService } from '@/services/StorageService';
import Colors from '@/constants/Colors';

export default function SafetyMap() {
    const [heatmapData, setHeatmapData] = useState<any[]>([]);
    const [markers, setMarkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleCheckIn = async (zoneId: number) => {
        try {
            const result = await SafetyService.checkInAtSafeZone('user_alex_123', zoneId);
            if (result && result.status === 'success') {
                Alert.alert("Success", result.message);
            }
        } catch (error) {
            Alert.alert("Error", "Could not complete check-in.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const isOffline = await StorageService.isOfflineMode();

            let hData: any[] = [];
            let mData: any[] = [];
            let zData: any[] = [];

            if (isOffline) {
                const savedPlaces = await StorageService.getSafePlaces();
                zData = savedPlaces.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    type: p.category.split(' / ')[0],
                    lat: 41.8902 + (Math.random() - 0.5) * 0.01,
                    lon: 12.4922 + (Math.random() - 0.5) * 0.01,
                    address: p.intel
                }));
            } else {
                hData = await SafetyService.getHeatmap();
                mData = await SafetyService.getNearbyScams();
                zData = await SafetyService.getNearbySafeZones(41.8902, 12.4922);
            }

            const formattedHeatmap = hData.map((point: any) => ({
                latitude: point.lat,
                longitude: point.lon,
                weight: point.weight
            }));

            setHeatmapData(formattedHeatmap);

            const scamMarkers = mData.map((m: any) => ({ ...m, category: 'scam' }));
            const safeMarkers = zData.map((z: any) => ({ ...z, category: 'safe_zone' }));

            setMarkers([...scamMarkers, ...safeMarkers]);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.light.tint} />
            </View>
        );
    }

    // Web fallback: show a styled data view instead of native maps
    return (
        <View style={styles.fallback}>
            <Text style={styles.fallbackTitle}>🗺️ Safety Intelligence Map</Text>
            <Text style={styles.fallbackSub}>Region: Rome, Italy</Text>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{heatmapData.length}</Text>
                    <Text style={styles.statLabel}>Risk Zones</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{markers.filter(m => m.category === 'safe_zone').length}</Text>
                    <Text style={styles.statLabel}>Safe Zones</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{markers.filter(m => m.category === 'scam').length}</Text>
                    <Text style={styles.statLabel}>Scam Reports</Text>
                </View>
            </View>

            {markers.filter(m => m.category === 'safe_zone').slice(0, 3).map((zone, i) => (
                <View key={i} style={styles.zoneRow}>
                    <Text style={styles.zoneIcon}>🏥</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.zoneName}>{zone.name}</Text>
                        <Text style={styles.zoneType}>{zone.type} • {zone.address}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.checkInBtn}
                        onPress={() => handleCheckIn(zone.id)}
                    >
                        <Text style={styles.checkInText}>CHECK-IN</Text>
                    </TouchableOpacity>
                </View>
            ))}

            <View style={styles.legend}>
                <Text style={styles.legendTitle}>Safety Legend</Text>
                <View style={styles.legendRow}>
                    <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendText}>High Risk Area</Text>
                </View>
                <View style={styles.legendRow}>
                    <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
                    <Text style={styles.legendText}>Verified Safe Zone</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallback: {
        backgroundColor: Colors.light.card,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    fallbackTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.light.text,
        marginBottom: 4,
    },
    fallbackSub: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.light.subtle,
        borderRadius: 14,
        padding: 14,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: '900',
        color: Colors.light.text,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: Colors.light.textSecondary,
        marginTop: 2,
    },
    zoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    zoneIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    zoneName: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
    },
    zoneType: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        marginTop: 2,
    },
    checkInBtn: {
        backgroundColor: Colors.light.safe,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    checkInText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '800',
    },
    legend: {
        marginTop: 12,
        backgroundColor: Colors.light.subtle,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    legendTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: Colors.light.text,
        marginBottom: 6,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 10,
        color: Colors.light.textSecondary,
        fontWeight: '600',
    },
});
