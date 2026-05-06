export type FormListItem = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  _count: {
    responses: number;
  };
};

export type FormListProps = {
  forms: FormListItem[];
};
