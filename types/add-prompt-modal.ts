export interface AddPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { prompt: string; topics?: string }) => void;
  isLoading?: boolean;
}
