import { NextRequest, NextResponse } from "next/server";
import { generateFormQuestions } from "./api";
import { getAuth } from "@clerk/nextjs/server";
import { promptSchema } from "@/lib/schema";
import { GetUserIP, rateLimiter } from "@/lib/rateLimiter";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const userIP = await GetUserIP();

    if (userIP) {
      await rateLimiter.consume(userIP, 2);
    } else {
      return NextResponse.json("Too many requests, Request overload", {
        status: 429,
        statusText: "Too Many Requests",
      });
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", details: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validationResult = promptSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten();
      return NextResponse.json(
        { error: "Invalid request", details: errors },
        { status: 400 }
      );
    }

    const { prompt, topics } = validationResult.data;
    const { data: generatedForm, provider } = await generateFormQuestions(
      prompt,
      topics
    );

    console.log(`Generated form data using ${provider}:`, generatedForm);

    return NextResponse.json({
      title: generatedForm.title,
      description: generatedForm.description,
      questions: generatedForm.questions,
      prompt,
      provider,
    });
  } catch (error) {
    console.error("Error in form generation API:", error);

    // Check if it's a rate limit error
    if (error && typeof error === "object" && "msBeforeNext" in error) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate form. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "Form generation API is running" });
}
