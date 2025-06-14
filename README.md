# Gemini API 代理服务

这是一个基于 Deno Deploy 的 Google Gemini API 代理服务，提供简单的 HTTP 接口来调用 Gemini 模型。

## 项目架构

```
├── main.ts              # 主入口文件，负责服务器启动和路由分发
├── routes/
│   └── chat.route.ts    # 聊天路由处理逻辑
├── services/
│   └── ai.service.ts    # AI服务核心逻辑
├── deno.json           # Deno配置文件
└── README.md           # 项目文档
```

## 功能特性

- 支持 Gemini 2.0 Flash 模型
- 可自定义系统指令
- 内置 CORS 支持
- 错误处理和参数验证
- 模块化架构，便于功能扩展

## API 接口

### POST /

**请求参数：**

```json
{
  "input": "你的问题或内容",
  "apikey": "你的 Gemini API Key",
  "systemInstruction": "可选的系统指令"
}
```

**参数说明：**

- `input` (必需): 要发送给 AI 的内容
- `apikey` (必需): 你的 Google Gemini API Key
- `systemInstruction` (可选): 自定义系统指令，默认为中文助理设定

**响应格式：**

```json
{
  "success": true,
  "response": "AI 的回复内容",
  "systemInstruction": "使用的系统指令"
}
```

## 部署到 Deno Deploy

1. 将代码推送到 GitHub 仓库
2. 在 [Deno Deploy](https://dash.deno.com/) 创建新项目
3. 连接你的 GitHub 仓库
4. 设置入口文件为 `main.ts`
5. 部署完成

## 本地开发

```bash
# 启动开发服务器
deno task dev

# 或直接运行
deno run --allow-net --allow-env main.ts
```

## 测试示例

部署完成后，你可以使用以下 curl 命令测试：

```bash
curl -X POST https://your-deploy-url.deno.dev \
  -H "Content-Type: application/json" \
  -d '{
    "input": "你好，请介绍一下自己",
    "apikey": "YOUR_GEMINI_API_KEY"
  }'
```

带自定义系统指令的测试：

```bash
curl -X POST https://your-deploy-url.deno.dev \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Hello, introduce yourself",
    "apikey": "YOUR_GEMINI_API_KEY",
    "systemInstruction": "You are a helpful assistant that responds in English"
  }'
```

## 注意事项

- 请妥善保管你的 API Key，不要在客户端代码中暴露
- 建议在生产环境中添加速率限制和身份验证
- 确保你的 Gemini API Key 有足够的配额