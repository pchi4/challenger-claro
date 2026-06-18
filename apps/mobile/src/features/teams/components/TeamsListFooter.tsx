import {
  AppErrorState,
  AppLoadingState
} from "@/shared/components";

interface TeamsListFooterProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
}

export function TeamsListFooter({
  isLoading,
  isError,
  errorMessage,
  onRetry
}: TeamsListFooterProps): React.JSX.Element | null {
  if (isLoading) {
    return <AppLoadingState />;
  }

  if (isError) {
    return <AppErrorState message={errorMessage} retry={onRetry} />;
  }

  return null;
}
