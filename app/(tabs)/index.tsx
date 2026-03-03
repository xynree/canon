import { supabase } from "@/lib/supabase";
import { Room } from "@/types";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRooms() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (e: any) {
      console.error("Error fetching rooms:", e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  const renderRoom = ({ item }: { item: Room }) => (
    <View style={styles.roomCard}>
      <Text style={styles.roomEmoji}>{item.emoji}</Text>
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomDate}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Your Rooms</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading rooms...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text onPress={fetchRooms} style={styles.retryText}>
            Tap to retry
          </Text>
        </View>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No rooms found.</Text>
              <Text style={styles.emptySubtext}>
                Seed data or check RLS settings.
              </Text>
            </View>
          }
          refreshing={loading}
          onRefresh={fetchRooms}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
  },
  listContent: {
    padding: 20,
  },
  roomCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  roomEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  roomDate: {
    fontSize: 14,
    color: "#6C757D",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6C757D",
  },
  errorText: {
    fontSize: 16,
    color: "#DC3545",
    textAlign: "center",
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#495057",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#ADB5BD",
    marginTop: 8,
  },
});
