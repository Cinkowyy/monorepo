import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { apiUrl } from "./src/config";

type Building = {
  id: number;
  name: string;
  address: string | null;
};

const queryClient = new QueryClient();

function BuildingsList() {
  const buildingsQuery = useQuery({
    queryKey: ["buildings"],
    queryFn: async (): Promise<Building[]> => {
      const response = await fetch(`${apiUrl}/buildings`);

      if (!response.ok) {
        throw new Error(`Failed to fetch buildings (${response.status})`);
      }

      return response.json();
    },
  });

  if (buildingsQuery.isPending) {
    return <ActivityIndicator />;
  }

  if (buildingsQuery.isError) {
    return <Text>Could not load buildings from {apiUrl}.</Text>;
  }

  if (buildingsQuery.data.length === 0) {
    return <Text>No buildings yet.</Text>;
  }

  return (
    <FlatList
      data={buildingsQuery.data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Text style={styles.item}>
          {item.name}
          {item.address ? ` — ${item.address}` : ""}
        </Text>
      )}
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <Text style={styles.title}>Buildings</Text>
        <BuildingsList />
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
  },
});
