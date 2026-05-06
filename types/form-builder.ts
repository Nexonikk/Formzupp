export type FormBuilderQuestion = {
  id: string;
  text: string;
};

export type FormBuilderProps = {
  initialData?: {
    id?: string;
    title: string;
    description: string | null;
    questions: FormBuilderQuestion[];
  };
  isEditing?: boolean;
};
