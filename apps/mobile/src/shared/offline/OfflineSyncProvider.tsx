import { PropsWithChildren, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNetInfo } from "@react-native-community/netinfo";
import { syncOfflineMutations } from "@/shared/offline/offlineSync";

export function OfflineSyncProvider({
  children
}: Readonly<PropsWithChildren>): React.JSX.Element {
  const netInfo = useNetInfo();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (netInfo.isConnected === true) {
      void syncOfflineMutations(queryClient);
    }
  }, [netInfo.isConnected, queryClient]);

  return <>{children}</>;
}
