// Run: SAKURA_AI_ENGINE_API_KEY=... bun run examples/response.ts
import { createClient } from "./_client";

const client = createClient();

const result = await client.createResponse({
  model: "your-model",
  input: "Hello!",
});

console.log(result);
