"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import FormCard from "./form-card";
import CreateFormButton from "../prompt-modal/create-form-button";

type Form = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  _count: {
    responses: number;
  };
};
type FormListProps = {
  forms: Form[];
};
export default function FormList({ forms }: FormListProps) {
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search forms..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-sm"
        />
        <CreateFormButton />
      </div>

      {filteredForms.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No forms found. Create your first form!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <FormCard
              key={form.id}
              id={form.id}
              title={form.title}
              description={form.description}
              responsesCount={form._count.responses}
              createdAt={form.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
