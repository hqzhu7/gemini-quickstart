import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { handleChatRequest } from "./routes/chat.route.ts";

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  // 路由分发
  if (url.pathname === "/" || url.pathname === "/chat") {
    return await handleChatRequest(request);
  }
  
  // 404 处理
  return new Response(
    JSON.stringify({ error: "Not Found" }),
    { 
      status: 404, 
      headers: { "Content-Type": "application/json" } 
    }
  );
}

// 启动服务器
serve(handleRequest, { port: 8000 });
console.log("Server running on http://localhost:8000");
console.log("Available endpoints:");
console.log("  POST / - Chat with AI");
console.log("  POST /chat - Chat with AI");