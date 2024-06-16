import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';



const genAI = new  GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    console.log("started")
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;
    console.log(messages);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateImage(messages[0].content);
    const response = result.response;
    const text = response.text();
    console.log(text);
    return NextResponse.json(text);
  } 
  catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
