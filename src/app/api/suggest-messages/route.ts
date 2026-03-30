import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

// Optional: Enable Edge runtime for better performance
export const runtime = 'edge'; 

export async function POST(req: Request) {
  try {
    // Generate an automatic prompt for suggested messages
    const prompt = "Create a list of 3 open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform (mystery message board), and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on casual and fun questions to get people talking. Only return the questions separated by '||'. Format example: 'What is a hobby you ve always wanted to try?||If you could have dinner with any historical figure, who would it be?||What is the most interesting book you ve read recently?'";

    const response = await streamText({
      model: openai('gpt-4o-mini'), // Model specifically suited for quick and cheap text generations
      messages: [{ role: 'user', content: prompt }],
    });

    // Respond with the stream
    return response.toTextStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      console.error("OpenAI API Error:", error.message);
      return NextResponse.json(
        { success: false, message: error.message }, 
        { status: 500 }
      );
    }
    console.error("Unexpected Error", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
