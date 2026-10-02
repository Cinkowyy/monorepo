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
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import superjson from "superjson";
import { apiUrl } from "./src/config";
import { isTrpcNotFound } from "./src/errors";
import { TRPCProvider, useTRPC } from "./src/trpc";

function PropertiesList({
  onSelect,
}: {
  onSelect: (id: number) => void;
}) {
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
      renderItem={({ item }) => (
        <Pressable onPress={() => onSelect(item.id)}>
          <Text style={styles.item}>{item.name}</Text>
        </Pressable>
      )}
    />
  );
}

function PropertyDetail({
  id,
  onBack,
}: {
  id: number;
  onBack: () => void;
}) {
  const trpc = useTRPC();
  const propertyQuery = useQuery(trpc.properties.byId.queryOptions({ id }));

  if (propertyQuery.isPending) {
    return <ActivityIndicator />;
  }

  if (propertyQuery.isError) {
    if (isTrpcNotFound(propertyQuery.error)) {
      return (
        <View>
          <Text style={styles.title}>Nie znaleziono</Text>
          <Text>Property o ID {id} nie istnieje.</Text>
          <Pressable onPress={onBack}>
            <Text style={styles.link}>Wróć do listy</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View>
        <Text>Could not load property.</Text>
        <Text>{propertyQuery.error.message}</Text>
        <Pressable onPress={onBack}>
          <Text style={styles.link}>Wróć do listy</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Properties</Text>
      </Pressable>
      <Text style={styles.title}>{propertyQuery.data.name}</Text>
      <Text>ID: {propertyQuery.data.id}</Text>
    </View>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
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
          {selectedId === null ? (
            <>
              <Text style={styles.title}>Properties</Text>
              <PropertiesList onSelect={setSelectedId} />
            </>
          ) : (
            <PropertyDetail
              id={selectedId}
              onBack={() => setSelectedId(null)}
            />
          )}
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
  link: {
    fontSize: 16,
    marginBottom: 16,
    textDecorationLine: "underline",
  },
});
