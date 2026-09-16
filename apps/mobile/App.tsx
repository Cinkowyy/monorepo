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
import type { PropertiesContractTypes } from "@app/core";

type Property = PropertiesContractTypes["getProperties"]["output"];

const queryClient = new QueryClient();

function PropertiesList() {
  const propertiesQuery = useQuery({
    queryKey: ["properties"],
    queryFn: async (): Promise<Property[]> => {
      const response = await fetch(`${apiUrl}/properties`);

      if (!response.ok) {
        throw new Error(`Failed to fetch properties (${response.status})`);
      }

      return response.json();
    },
  });

  if (propertiesQuery.isPending) {
    return <ActivityIndicator />;
  }

  if (propertiesQuery.isError) {
    return <Text>Could not load properties from {apiUrl}.</Text>;
  }

  if (propertiesQuery.data.length === 0) {
    return <Text>No properties yet.</Text>;
  }

  return (
    <FlatList
      data={propertiesQuery.data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <Text style={styles.title}>Properties</Text>
        <PropertiesList />
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
