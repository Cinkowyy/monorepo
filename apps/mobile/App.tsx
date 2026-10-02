import type { AppRouter } from "@app/trpc/router";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import superjson from "superjson";
import { apiUrl } from "./src/config";
import { TRPCProvider, useTRPC } from "./src/trpc";

function PropertiesList() {
  const trpc = useTRPC();
  const propertiesQuery = useQuery(trpc.properties.list.queryOptions());

  if (propertiesQuery.isPending) {
    return <ActivityIndicator />;
  }

  if (propertiesQuery.isError) {
    return (
      <Text>
        Could not load properties from {apiUrl}/api/trpc
        {"\n"}
        {propertiesQuery.error.message}
      </Text>
    );
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
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${apiUrl}/api/trpc`,
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <View style={styles.container}>
          <Text style={styles.title}>Properties</Text>
          <PropertiesList />
          <StatusBar style="auto" />
        </View>
      </TRPCProvider>
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
