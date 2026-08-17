// Run: SAKURA_AI_ENGINE_API_KEY=... bun run examples/speech.ts
import { createClient } from "./_client";

const client = createClient();

const wav = await client.createSpeech({
  model: "your-tts-model",
  input: "Hello!",
});

await Bun.write("speech.wav", wav);
console.log("Wrote speech.wav");
