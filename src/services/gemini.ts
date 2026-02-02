import { GoogleGenerativeAI, type Part } from "@google/generative-ai";

// For hackathon purposes, we'll expect the API key to be in the environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function explainFailure(log: string, context: string, files: File[]) {
    if (!API_KEY) {
        throw new Error("Gemini API Key not found. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    // Use the latest model - for Gemini 3.0 we normally use 'gemini-2.0-flash' or 'gemini-2.0-pro' 
    // as 3.0 nomenclature usually refers to the 2.0 series in current SDKs or internal 3.0 names.
    // We'll use the most capable multimodal model available.
    // Using Gemini 2.5 Flash - The 2026 standard for high-performance reasoning on the free tier.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fileParts: Part[] = await Promise.all(
        files.map(async (file) => {
            const base64 = await fileToBase64(file);
            return {
                inlineData: {
                    data: base64.split(",")[1],
                    mimeType: file.type,
                },
            };
        })
    );

    const prompt = `
    You are an expert software debugger and reasoning engine. 
    Analyze the following error log, visual evidence (including temporal analysis if a video is provided), and additional context to:
    1. Identify the root cause of the failure.
    2. Explain it in plain English, specifically correlating log timestamps with visual events.
    3. Suggest actionable next steps.

    ERROR LOG:
    ${log || "No log provided."}

    USER CONTEXT:
    ${context || "No additional context provided."}

    Return your response in JSON format with the following keys:
    {
      "rootCause": "Detailed explanation of why it failed",
      "explanation": "Plain English summary",
      "nextSteps": ["Step 1", "Step 2", "..."]
    }
  `;

    try {
        const result = await model.generateContent([prompt, ...fileParts]);
        const response = await result.response;
        const text = response.text();

        // Extract JSON if model wraps it in markdown blocks
        const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}
