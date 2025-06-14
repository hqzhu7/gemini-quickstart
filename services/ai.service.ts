// services/ai.service.
import { GoogleGenAI } from "npm:@google/genai";

const DEFAULT_SYSTEM_INSTRUCTION = "你是一个高效的助理，能分布思考解决用户的问题，你一般都用中文回答内容";

export interface AIRequest {
  input: string;
  apikey: string;
  systemInstruction?: string;
}

export interface AIResponse {
  success: boolean;
  response?: string;
  systemInstruction?: string;
  error?: string;
  details?: string;
}

export async function processAIRequest(request: AIRequest): Promise<AIResponse> {
  try {
    // 验证必需参数
    if (!request.input) {
      return {
        success: false,
        error: "Missing required parameter: input"
      };
    }

    if (!request.apikey) {
      return {
        success: false,
        error: "Missing required parameter: apikey"
      };
    }

    // 使用提供的systemInstruction或默认值
    const finalSystemInstruction = request.systemInstruction || DEFAULT_SYSTEM_INSTRUCTION;

    // 初始化GoogleGenAI
    const ai = new GoogleGenAI({ apiKey: request.apikey });

    // 调用Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: request.input,
      config: {
        systemInstruction: finalSystemInstruction,
      },
    });

    return {
      success: true,
      response: response.text,
      systemInstruction: finalSystemInstruction
    };

  } catch (error) {
    console.error("Error processing AI request:", error);
    return {
      success: false,
      error: "Internal server error",
      details: error.message
    };
  }
}

