// services/ai.service.
import { GoogleGenAI } from "npm:@google/genai";

const DEFAULT_SYSTEM_INSTRUCTION = "你是一个高效的助理，能分布思考解决用户的问题，你一般都用中文回答内容";

export interface MessageObject {
  role: string;
  content: string;
}

export interface AIRequest {
  input?: string | Array<MessageObject>;
  messageList?: Array<MessageObject>;
  apikey: string;
  systemInstruction?: string;
  temperature?: number;
}

export interface AIResponse {
  success: boolean;
  response?: string;
  error?: string;
  details?: string;
}

export async function processAIRequest(request: AIRequest): Promise<AIResponse> {
  try {
    // 验证必需参数 - 支持input或messageList
    const inputData = request.input || request.messageList;
    if (!inputData) {
      return {
        success: false,
        error: "Missing required parameter: input or messageList"
      };
    }

    if (!request.apikey) {
      return {
        success: false,
        error: "Missing required parameter: apikey"
      };
    }

    // 验证temperature参数
    const temperature = request.temperature ?? 1; // 默认值为1
    if (temperature < 0 || temperature > 2) {
      return {
        success: false,
        error: "Temperature must be between 0 and 2"
      };
    }

    // 处理input类型判断和转换
    let contents: any;
    if (typeof inputData === 'string') {
      // 如果是字符串，直接使用
      contents = inputData;
    } else if (Array.isArray(inputData)) {
      // 如果是数组，验证格式并转换为Gemini API格式
      for (const msg of inputData) {
        if (!msg.role || !msg.content) {
          return {
            success: false,
            error: "Array input must contain objects with 'role' and 'content' properties"
          };
        }
      }
      // 转换为Gemini API格式
      contents = inputData.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role, // Gemini使用'model'而不是'assistant'
        parts: [{ text: msg.content }]
      }));
    } else {
      return {
        success: false,
        error: "Input must be either a string or an array of message objects"
      };
    }

    // 使用提供的systemInstruction或默认值
    const finalSystemInstruction = request.systemInstruction || DEFAULT_SYSTEM_INSTRUCTION;

    // 初始化GoogleGenAI
    const ai = new GoogleGenAI({ apiKey: request.apikey });

    // 调用Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
      config: {
        systemInstruction: finalSystemInstruction,
        temperature: temperature,
      },
    });

    return {
      success: true,
      response: response.text
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

