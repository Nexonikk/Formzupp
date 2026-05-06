import { Question } from "@prisma/client";

export interface Message {
  id: string;
  source: "system" | "user";
  content: React.ReactNode;
}

export interface FormCompletionData {
  answers: { questionId: string; text: string }[];
  respondentName: string;
  respondentEmail: string;
}

export interface FormChatInterfaceProps {
  formTitle: string;
  formDescription: string | null;
  questions: Question[];
  onComplete: (data: FormCompletionData) => Promise<void>;
}
