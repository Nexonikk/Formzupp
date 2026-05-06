export type ResponseProps = {
  response: {
    id: string;
    createdAt: Date;
    respondentName: string | null;
    respondentEmail: string | null;
    answers: {
      id: string;
      text: string;
      question: {
        id: string;
        text: string;
        order: number;
      };
    }[];
  };
};
