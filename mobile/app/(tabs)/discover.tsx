import React from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SafetyMap from '@/components/SafetyMap';
import { StorageService } from '@/services/StorageService';
import { SafetyService } from '@/services/SafetyService';

const theme = Colors.light;

const PLACES = [
  {
    id: 1,
    name: "St. Peter's Pharmacy",
    category: "Medical / Safe Zone",
    safety: "98",
    intel: "Staff speak 5 languages. Official safe point for pilgrims.",
    image: "https://images.unsplash.com/photo-1584030373083-d951a06a77ad?w=400&q=80"
  },
  {
    id: 2,
    name: "Trevi Tourist Point",
    category: "Police / Info",
    safety: "94",
    intel: "High police presence. Report distraction scams here.",
    image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=400&q=80"
  }
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [downloading, setDownloading] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    const checkOffline = async () => {
      const offline = await StorageService.isOfflineMode();
      setIsOffline(offline);
    };
    checkOffline();
  }, []);

  const toggleOffline = async () => {
    const nextMode = !isOffline;
    await StorageService.setOfflineMode(nextMode);
    setIsOffline(nextMode);
    Alert.alert(nextMode ? "Offline Mode Active" : "Online Mode Active",
      nextMode ? "App will use cached safety data." : "App will fetch real-time data.");
  };

  const openInsight = (query: string) => {
    router.push({ pathname: '/chat', params: { query } });
  };

  const downloadSafePack = async () => {
    setDownloading(true);
    try {
      const heatmap = await SafetyService.getHeatmap();
      const scams = await SafetyService.getNearbyScams();

      await StorageService.saveSafePacks({
        places: PLACES,
        insights: [
          { id: 1, title: 'Tipping', content: 'Rounding up is common.' },
          { id: 2, title: 'Transit', content: 'Validate tickets!' }
        ],
        contacts: [{ name: 'Police', number: '112' }]
      });

      Alert.alert("SafePack Downloaded", "You can now access safety data for Rome even without an internet connection.");
    } catch (error) {
      Alert.alert("Download Failed", "Please check your connection and try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <MaterialIcons name="cloud-off" size={16} color="white" />
          <Text style={styles.offlineText}>SAFEQUEST OFFLINE: Using Cached Region Data</Text>
        </View>
      )}

      <View style={styles.searchBar}>
        <FontAwesome name="search" size={18} color={theme.textSecondary} />
        <TextInput
          placeholder="Search safe places, museums..."
          style={styles.searchInput}
          placeholderTextColor={theme.textSecondary}
        />
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={toggleOffline} style={{ marginRight: 15 }}>
            <MaterialIcons
              name={isOffline ? "toggle-on" : "toggle-off"}
              size={28}
              color={isOffline ? theme.tint : theme.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={downloadSafePack} disabled={downloading}>
            <MaterialIcons
              name={downloading ? "hourglass-empty" : "cloud-download"}
              size={24}
              color={theme.tint}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { paddingHorizontal: 20, marginBottom: 15 }]}>Live Safety Heatmap</Text>
        <SafetyMap key={isOffline ? 'offline' : 'online'} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { paddingHorizontal: 20, marginBottom: 15 }]}>Cultural Insights</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <TouchableOpacity style={styles.insightCard} onPress={() => openInsight('What is the basilica etiquette in Rome?')}>
            <MaterialCommunityIcons name="church" size={32} color={theme.cultural} />
            <Text style={styles.insightLabel}>Basilica Etiquette</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.insightCard} onPress={() => openInsight('Tipping etiquette in Italy')}>
            <FontAwesome name="cutlery" size={32} color={theme.safe} />
            <Text style={styles.insightLabel}>Tipping Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.insightCard} onPress={() => openInsight('How to use public transit in Rome without getting fined?')}>
            <MaterialCommunityIcons name="bus-alert" size={32} color={theme.warning} />
            <Text style={styles.insightLabel}>Public Transit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Verified Safe Places</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        {PLACES.map((place) => (
          <TouchableOpacity key={place.id} style={styles.placeCard}>
            <Image source={{ uri: place.image }} style={styles.placeImage} />
            <View style={styles.placeInfo}>
              <View style={styles.placeHeader}>
                <Text style={styles.placeName}>{place.name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{place.safety}</Text>
                </View>
              </View>
              <Text style={styles.placeCategory}>{place.category}</Text>
              <Text style={styles.placeIntel} numberOfLines={2}>{place.intel}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    margin: 20,
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  offlineBanner: {
    backgroundColor: theme.tint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  offlineText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: theme.text,
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.text,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  viewAll: {
    fontSize: 14,
    color: theme.tint,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingLeft: 20,
    backgroundColor: 'transparent',
  },
  insightCard: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 20,
    marginRight: 15,
    width: 140,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  insightLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    color: theme.text,
  },
  placeCard: {
    backgroundColor: theme.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
  },
  placeImage: {
    width: '100%',
    height: 180,
  },
  placeInfo: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  placeName: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.text,
  },
  ratingBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.safe,
  },
  placeCategory: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  placeIntel: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
});
