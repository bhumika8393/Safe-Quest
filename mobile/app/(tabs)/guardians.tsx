import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafetyService } from '@/services/SafetyService';
import Leaderboard from '@/components/Leaderboard';
import GuardianVerification from '@/components/GuardianVerification';



export default function GuardiansScreen() {
    const [incidentId, setIncidentId] = useState('');
    const [activeLocation, setActiveLocation] = useState<{ lat: number, long: number } | null>(null);
    const [tracking, setTracking] = useState(false);
    const [loading, setLoading] = useState(false);

    const startTracking = async () => {
        if (!incidentId) return;
        setLoading(true);
        try {
            const data = await fetch(`http://localhost:3000/safety/sos/tracker/${incidentId}`).then(res => res.json());
            if (data) {
                setActiveLocation(data);
                setTracking(true);
            } else {
                alert('No active incident found for this ID.');
            }
        } catch (error) {
            console.error('Tracking Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval: any;
        if (tracking && incidentId) {
            interval = setInterval(async () => {
                try {
                    const data = await fetch(`http://localhost:3000/safety/sos/tracker/${incidentId}`).then(res => res.json());
                    if (data) {
                        setActiveLocation(data);
                    } else {
                        setTracking(false);
                        setActiveLocation(null);
                        alert('Incident has been resolved.');
                    }
                } catch (e) {
                    console.error('Polling Error:', e);
                }
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [tracking, incidentId]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Guardian Dashboard</Text>
                <Text style={styles.subtitle}>Track active SOS incidents or manage contacts.</Text>
            </View>

            <View style={styles.searchSection}>
                <Text style={styles.label}>Incident Tracking ID</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. INC-A1B2C3"
                        value={incidentId}
                        onChangeText={setIncidentId}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity style={styles.trackButton} onPress={startTracking} disabled={loading}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.trackText}>Track</Text>}
                    </TouchableOpacity>
                </View>
            </View>

            {activeLocation && (
                <View style={styles.mapContainer}>
                    <View style={styles.incidentStatus}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>LIVE BROADCAST ACTIVE</Text>
                    </View>
                    <View style={styles.liveLocationCard}>
                        <Ionicons name="location" size={40} color={Colors.light.sos} />
                        <Text style={styles.liveLocationTitle}>Live SOS Location</Text>
                        <Text style={styles.liveCoords}>
                            Lat: {activeLocation.lat.toFixed(6)}
                        </Text>
                        <Text style={styles.liveCoords}>
                            Long: {activeLocation.long.toFixed(6)}
                        </Text>
                        <Text style={styles.livePulse}>📡 Updating every 5 seconds...</Text>
                    </View>
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Protected Contacts</Text>
                <View style={styles.contactCard}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }} style={styles.contactAvatar} />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>Alex Morgan (You)</Text>
                        <Text style={styles.contactStatus}>Status: Active in Rome</Text>
                    </View>
                    <Ionicons name="shield-checkmark" size={24} color={Colors.light.safe} />
                </View>
                <View style={styles.contactCard}>
                    <View style={[styles.contactAvatar, { backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }]}>
                        <Ionicons name="add" size={24} color="#94A3B8" />
                    </View>
                    <Text style={styles.addText}>Add Protected Contact</Text>
                </View>
            </View>

            <GuardianVerification />

            <Leaderboard />
        </ScrollView>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        padding: 24,
        paddingTop: 30,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0F172A',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
        fontWeight: '500',
    },
    searchSection: {
        margin: 20,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    input: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    trackButton: {
        backgroundColor: Colors.light.tint,
        paddingHorizontal: 20,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trackText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 14,
    },
    mapContainer: {
        marginHorizontal: 20,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 20,
    },
    liveLocationCard: {
        backgroundColor: '#FEF2F2',
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    liveLocationTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginTop: 10,
    },
    liveCoords: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        fontFamily: 'monospace',
        marginTop: 4,
    },
    livePulse: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 12,
    },
    incidentStatus: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.sos,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.sos,
        marginRight: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
        color: Colors.light.sos,
    },
    userMarker: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.light.sos,
        borderWidth: 2,
        borderColor: 'white',
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        padding: 10,
        borderRadius: 10,
    },
    locationInfo: {
        color: 'white',
        fontSize: 10,
        fontFamily: 'monospace',
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 40,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 15,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 1,
    },
    contactAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 15,
    },
    contactInfo: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    contactName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    contactStatus: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    addText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#94A3B8',
    }
});
