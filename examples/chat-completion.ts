// Run: SAKURA_AI_ENGINE_API_KEY=... bun run examples/chat-completion.ts
import { createClient } from "./_client";

const client = createClient();

const result = await client.createChatCompletion({
  model: "your-model",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(result);
