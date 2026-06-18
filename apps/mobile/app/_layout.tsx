import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "@/shared/api/queryClient";
import { OfflineSyncProvider } from "@/shared/offline/OfflineSyncProvider";
import { colors } from "@/shared/theme";

export default function RootLayout(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <OfflineSyncProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.background
              },
              headerShown: false,
              headerShadowVisible: false,
              headerTintColor: colors.text,
              contentStyle: {
                backgroundColor: colors.background
              }
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="teams/index"
              options={{
                title: "Times"
              }}
            />
            <Stack.Screen
              name="teams/create"
              options={{
                title: "Novo time"
              }}
            />
            <Stack.Screen
              name="teams/[id]/edit"
              options={{
                title: "Editar time"
              }}
            />
            <Stack.Screen
              name="tasks/index"
              options={{
                title: "Tarefas"
              }}
            />
            <Stack.Screen
              name="tasks/create"
              options={{
                title: "Nova tarefa"
              }}
            />
            <Stack.Screen
              name="tasks/[id]"
              options={{
                title: "Detalhes da tarefa"
              }}
            />
            <Stack.Screen
              name="tasks/[id]/edit"
              options={{
                title: "Editar tarefa"
              }}
            />
          </Stack>
          <StatusBar style="light" />
        </OfflineSyncProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
