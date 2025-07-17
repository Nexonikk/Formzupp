import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type ResponseProps = {
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

export default function FormResponse({ response }: ResponseProps) {
  const formattedDate = new Date(response.createdAt).toLocaleDateString();
  const formattedTime = new Date(response.createdAt).toLocaleTimeString();

  console.log(response);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div>
            {response.respondentName
              ? `From: ${response.respondentName}`
              : "Anonymous Response"}
            {response.respondentEmail && (
              <span className="text-gray-500 text-sm ml-2">
                ({response.respondentEmail})
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {formattedDate} at {formattedTime}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {response.answers.map((answer) => (
            <div key={answer.id}>
              <h3 className="font-medium">{answer.question.text}</h3>
              <p className="mt-1 whitespace-pre-wrap">{answer.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
