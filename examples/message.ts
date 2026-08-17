// Run: SAKURA_AI_ENGINE_API_KEY=... bun run examples/message.ts
import { createClient } from "./_client";

const client = createClient();

const result = await client.createMessage({
  model: "your-model",
  maxTokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(result);
