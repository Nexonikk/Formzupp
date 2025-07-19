"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Question } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  source: "system" | "user";
  content: React.ReactNode;
}

export interface FormCompletionData {
  answers: { questionId: string; text: string }[];
  respondentName: string;
  respondentEmail: string;
}

interface FormChatInterfaceProps {
  formTitle: string;
  formDescription: string | null;
  questions: Question[];
  onComplete: (data: FormCompletionData) => Promise<void>;
}

export default function FormChatInterface({
  formTitle,
  formDescription,
  questions,
  onComplete,
}: FormChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<
    { questionId: string; text: string }[]
  >([]);
  const [respondentName, setRespondentName] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableNode = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollableNode) {
        scrollableNode.scrollTo({
          top: scrollableNode.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const preliminaryQuestions = [
    { id: "name", text: "To get started, what is your name?" },
    {
      id: "email",
      text: `Thanks, ${
        respondentName.split(" ")[0]
      }! What is your email address?`,
    },
  ];

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        source: "system",
        content: (
          <div className="space-y-2">
            <h3 className="font-bold text-lg">{formTitle}</h3>
            {formDescription && (
              <p className="text-gray-300">{formDescription}</p>
            )}
            <h5>
              Please Answer the following {questions.length} Questions. Lets
              Begin.
            </h5>
          </div>
        ),
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: "ask-name",
          source: "system",
          content: preliminaryQuestions[0].text,
        },
      ]);
    }, 1000);
  }, [formTitle, formDescription]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmitAnswer = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isCompleted) return;

    const userAnswer: Message = {
      id: `user-${Date.now()}`,
      source: "user",
      content: inputValue,
    };
    setMessages((prev) => [...prev, userAnswer]);
    const originalInput = inputValue;
    setInputValue("");

    setTimeout(() => {
      if (currentStep === 0) {
        setRespondentName(originalInput);
        setMessages((prev) => [
          ...prev,
          {
            id: "ask-email",
            source: "system",
            content: `Thanks, ${
              originalInput.split(" ")[0]
            }! What is your email address?`,
          },
        ]);
        setCurrentStep(1);
      } else if (currentStep === 1) {
        setRespondentEmail(originalInput);
        setMessages((prev) => [
          ...prev,
          {
            id: `ask-question-0`,
            source: "system",
            content: questions[0].text,
          },
        ]);
        setCurrentStep(2);
      } else {
        const questionIndex = currentStep - 2;
        const currentQuestion = questions[questionIndex];

        setAnswers((prev) => [
          ...prev,
          { questionId: currentQuestion.id, text: originalInput.trim() },
        ]);

        const nextQuestionIndex = questionIndex + 1;
        if (nextQuestionIndex < questions.length) {
          setMessages((prev) => [
            ...prev,
            {
              id: `ask-question-${nextQuestionIndex}`,
              source: "system",
              content: questions[nextQuestionIndex].text,
            },
          ]);
          setCurrentStep(currentStep + 1);
        } else {
          setIsCompleted(true);
          const finalAnswers = [
            ...answers,
            { questionId: currentQuestion.id, text: originalInput.trim() },
          ];
          setMessages((prev) => [
            ...prev,
            {
              id: "completion",
              source: "system",
              content:
                "Thank you for completing the form! Submitting your answers...",
            },
          ]);
          onComplete({
            answers: finalAnswers,
            respondentName,
            respondentEmail: originalInput,
          });
        }
      }
    }, 700);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto dark:bg-black text-white rounded-lg shadow-2xl overflow-hidden">
        <ScrollArea
          className="flex-1 overflow-y-scroll no-scrollbar"
          ref={scrollAreaRef}
        >
          <div className="p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-3 w-full ${
                  message.source === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.source === "system" && (
                  <Avatar className="h-8 w-8 bg-gray-700 flex-shrink-0">
                    <Bot className="h-5 w-5 m-auto text-gray-300" />
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.source === "user"
                      ? "bg-[#272729] text-[#00e599] rounded-br-none"
                      : "bg-[#37373A] text-white rounded-bl-none"
                  }`}
                >
                  {message.content}
                </div>
                {message.source === "user" && (
                  <Avatar className="h-8 w-8 bg-[#00e599] flex-shrink-0">
                    <User className="h-5 w-5 m-auto text-black" />
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      {/* -------------------------------------------- */}
      <div className="px-4">
        {!isCompleted && (
          <form
            onSubmit={handleSubmitAnswer}
            className="flex items-center gap-2 mx-auto max-w-4xl bg-black h-20 z-20"
          >
            <Input
              type="text"
              placeholder="Type your answer..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-[#37373A] relative text-white placeholder:text-gray-400 rounded-full h-12 px-5"
              autoFocus
            />
            <Button
              type="submit"
              className="rounded-full bg-[#00e599] hover:bg-[#00e5bf] h-12 w-12"
              size="icon"
            >
              <Send className="h-6 w-6" />
            </Button>
          </form>
        )}
        <h5 className="flex items-center justify-center w-full text-gray-400">
          Powered By&nbsp;<span className="text-[#00e599]">Formzupp</span>
        </h5>
      </div>
    </div>
  );
}
