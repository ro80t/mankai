// Run: SAKURA_AI_ENGINE_API_KEY=... bun run examples/transcription.ts <path-to-audio-file>
import { createClient } from "./_client";

const client = createClient();

const filePath = process.argv[2];
if (!filePath) {
  throw new Error("Usage: bun run examples/transcription.ts <path-to-audio-file>");
}

const result = await client.createTranscription({
  file: Bun.file(filePath),
});

console.log(result);
