import React, { useState, useEffect } from 'react';

import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import SOSButton from '@/components/SOSButton';
import Colors from '@/constants/Colors';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { SafetyService } from '@/services/SafetyService';
import ScamReportModal from '@/components/ScamReportModal';
import CommunityTips from '@/components/CommunityTips';


import * as LocalAuthentication from 'expo-local-authentication';

export default function HomeScreen() {
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<{ level: string, description: string, score: number } | null>(null);

  const authenticateAndTrigger = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      triggerSOS();
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to trigger SOS silent alert',
      fallbackLabel: 'Use Passcode',
    });

    if (result.success) {
      triggerSOS();
    }
  };


  useEffect(() => {
    const fetchRisk = async () => {
      // Mocked location for Trastevere
      const data = await SafetyService.getRiskLevel(41.8892, 12.4687);
      setRiskLevel(data);
    };
    fetchRisk();
  }, []);

  React.useEffect(() => {
    let interval: any;
    if (activeIncidentId) {
      interval = setInterval(async () => {
        // Mocked changing location to simulate movement
        const lat = 41.8892 + (Math.random() - 0.5) * 0.001;
        const long = 12.4687 + (Math.random() - 0.5) * 0.001;

        await SafetyService.updateLocation(activeIncidentId, { lat, long });
        console.log('Location broadcasted for SOS:', activeIncidentId);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeIncidentId]);

  const triggerSOS = async () => {

    try {
      // Mocked userId and location for now
      const result = await SafetyService.triggerSOS('user_alex_123', { lat: 41.8892, long: 12.4687 });
      setActiveIncidentId(result.incidentId);
      Alert.alert("SOS Triggered", "Emergency contacts and authorities have been notified.");
    } catch (error) {
      Alert.alert("Error", "Could not connect to safety services. Please try calling emergency numbers directly.");
    }
  };

  const cancelSOS = () => {
    if (activeIncidentId) {
      // In a real app, we might want to confirm if they are safe before clearing
      Alert.alert(
        "Incident Active",
        "Are you safe now?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes, I'm Safe",
            onPress: async () => {
              await SafetyService.resolveSOS(activeIncidentId);
              setActiveIncidentId(null);
            }
          }
        ]
      );
    }
  };


  const [scamModalVisible, setScamModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Your Safety Score</Text>
          <Text style={styles.scoreValue}>82</Text>
        </View>
        <TouchableOpacity style={styles.profileIcon} onPress={() => Alert.alert("Profile", "Coming soon!")}>
          <FontAwesome name="user-circle" size={32} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>

      <View style={[
        styles.alertBox,
        riskLevel?.level === 'High' ? styles.alertHigh : styles.alertLow
      ]}>
        <View style={styles.alertHeader}>
          <MaterialIcons
            name={riskLevel?.level === 'High' ? "warning" : "security"}
            size={24}
            color={riskLevel?.level === 'High' ? Colors.light.sos : Colors.light.safe}
          />
          <Text style={[
            styles.alertTitle,
            riskLevel?.level === 'High' ? { color: Colors.light.sos } : { color: Colors.light.safe }
          ]}>
            Area: Trastevere ({riskLevel?.level || 'Checking...'})
          </Text>
        </View>
        <Text style={[
          styles.alertDescription,
          riskLevel?.level === 'High' ? { color: '#991B1B' } : { color: '#065F46' }
        ]}>
          {riskLevel?.description || 'Fetching local safety intelligence...'}
        </Text>
      </View>


      <View style={styles.sosSection}>
        <Text style={styles.sectionTitle}>Emergency Assistance</Text>
        <SOSButton onTrigger={triggerSOS} onCancel={cancelSOS} />
        {activeIncidentId && <Text style={styles.sosStatus}>SOS ACTIVE - Broadcasting GPS</Text>}

        <TouchableOpacity style={styles.silentButton} onPress={authenticateAndTrigger}>
          <MaterialIcons name="fingerprint" size={20} color="#64748B" />
          <Text style={styles.silentText}>Silent Biometric Trigger</Text>
        </TouchableOpacity>

        <Text style={styles.sosHint}>Long-press the button for 3 seconds to trigger SOS</Text>

      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert("Safe Zones", "Navigating to nearest Medical Point...")}>
          <FontAwesome name="map-marker" size={24} color={Colors.light.safe} />
          <Text style={styles.actionLabel}>Safe Zones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => setScamModalVisible(true)}>
          <MaterialIcons name="report-problem" size={24} color={Colors.light.sos} />
          <Text style={styles.actionLabel}>Report Scam</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert("Contacts", "Emergency local numbers synced.")}>
          <FontAwesome name="phone" size={24} color={Colors.light.tint} />
          <Text style={styles.actionLabel}>Contacts</Text>
        </TouchableOpacity>
      </View>

      <CommunityTips location="Rome" />

      <ScamReportModal

        visible={scamModalVisible}
        onClose={() => setScamModalVisible(false)}
      />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  scoreContainer: {
    backgroundColor: 'transparent',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileIcon: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  alertBox: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  alertHigh: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  alertLow: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  alertHeader: {

    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: '#B45309',
    lineHeight: 20,
  },
  sosSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    color: '#0F172A',
  },
  sosStatus: {
    color: Colors.light.sos,
    fontWeight: '800',
    marginTop: 10,
    fontSize: 14,
  },
  sosHint: {
    marginTop: 20,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  silentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  silentText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  quickActions: {


    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    width: '30%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
});

