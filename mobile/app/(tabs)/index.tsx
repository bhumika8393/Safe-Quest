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

const theme = Colors.light;

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
      const data = await SafetyService.getRiskLevel(41.8892, 12.4687);
      setRiskLevel(data);
    };
    fetchRisk();
  }, []);

  React.useEffect(() => {
    let interval: any;
    if (activeIncidentId) {
      interval = setInterval(async () => {
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
      const result = await SafetyService.triggerSOS('user_alex_123', { lat: 41.8892, long: 12.4687 });
      setActiveIncidentId(result.incidentId);
      Alert.alert("SOS Triggered", "Emergency contacts and authorities have been notified.");
    } catch (error) {
      Alert.alert("Error", "Could not connect to safety services. Please try calling emergency numbers directly.");
    }
  };

  const cancelSOS = () => {
    if (activeIncidentId) {
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
          <FontAwesome name="user-circle" size={32} color={theme.tint} />
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
            color={riskLevel?.level === 'High' ? theme.sos : theme.safe}
          />
          <Text style={[
            styles.alertTitle,
            riskLevel?.level === 'High' ? { color: theme.sos } : { color: theme.safe }
          ]}>
            Area: Trastevere ({riskLevel?.level || 'Checking...'})
          </Text>
        </View>
        <Text style={[
          styles.alertDescription,
          riskLevel?.level === 'High' ? { color: '#FCA5A5' } : { color: '#86EFAC' }
        ]}>
          {riskLevel?.description || 'Fetching local safety intelligence...'}
        </Text>
      </View>


      <View style={styles.sosSection}>
        <Text style={styles.sectionTitle}>Emergency Assistance</Text>
        <SOSButton onTrigger={triggerSOS} onCancel={cancelSOS} />
        {activeIncidentId && <Text style={styles.sosStatus}>SOS ACTIVE - Broadcasting GPS</Text>}

        <TouchableOpacity style={styles.silentButton} onPress={authenticateAndTrigger}>
          <MaterialIcons name="fingerprint" size={20} color={theme.textSecondary} />
          <Text style={styles.silentText}>Silent Biometric Trigger</Text>
        </TouchableOpacity>

        <Text style={styles.sosHint}>Long-press the button for 3 seconds to trigger SOS</Text>

      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert("Safe Zones", "Navigating to nearest Medical Point...")}>
          <FontAwesome name="map-marker" size={24} color={theme.safe} />
          <Text style={styles.actionLabel}>Safe Zones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => setScamModalVisible(true)}>
          <MaterialIcons name="report-problem" size={24} color={theme.sos} />
          <Text style={styles.actionLabel}>Report Scam</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert("Contacts", "Emergency local numbers synced.")}>
          <FontAwesome name="phone" size={24} color={theme.tint} />
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
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 20,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  scoreContainer: {
    backgroundColor: 'transparent',
  },
  scoreLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.text,
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
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  alertLow: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
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
    marginLeft: 8,
  },
  alertDescription: {
    fontSize: 14,
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
    color: theme.text,
  },
  sosStatus: {
    color: theme.sos,
    fontWeight: '800',
    marginTop: 10,
    fontSize: 14,
  },
  sosHint: {
    marginTop: 20,
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  silentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  silentText: {
    marginLeft: 8,
    fontSize: 13,
    color: theme.textSecondary,
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
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 20,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: theme.textSecondary,
  },
});
