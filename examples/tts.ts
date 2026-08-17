// VOICEVOX-compatible TTS: build an audio query, then synthesize it into a WAV file.
// Run: SAKURA_AI_ENGINE_API_KEY=... bun run examples/tts.ts
import { createClient } from "./_client";

const client = createClient();

const audioQuery = await client.createTtsAudioQuery({ text: "Hello!", speaker: 1 });

const wav = await client.synthesizeTtsSpeech({
  speaker: 1,
  ttsSynthesisRequest: { ...audioQuery, kana: audioQuery.kana ?? "" },
});

await Bun.write("tts.wav", wav);
console.log("Wrote tts.wav");
