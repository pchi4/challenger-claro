import { useLocalSearchParams } from "expo-router";
import { EditTaskScreen } from "@/features/tasks/screens/EditTaskScreen";

export default function EditTaskRoute(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <EditTaskScreen taskId={normalizeRouteId(id)} />;
}

function normalizeRouteId(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
