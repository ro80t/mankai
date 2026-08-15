# mankai

A TypeScript client for the [Sakura AI Engine Inference API](https://manual.sakura.ad.jp/cloud/ai-engine/02-howto.html).

## Installation

```sh
bun add mankai
```

## Usage

```ts
import { AiEngine } from "mankai";

const client = new AiEngine({ apiKey: process.env.SAKURA_AI_ENGINE_API_KEY! });

// Chat completion (OpenAI Chat Completions compatible)
const chatCompletion = await client.createChatCompletion({
  model: "your-model",
  messages: [{ role: "user", content: "Hello!" }],
});

// Embeddings
const embeddings = await client.createEmbeddings({
  model: "your-embedding-model",
  input: "Hello!",
});

// Message (Anthropic Messages API compatible)
const message = await client.createMessage({
  model: "your-model",
  maxTokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});

// Response (OpenAI Responses API compatible)
const response = await client.createResponse({
  model: "your-model",
  input: "Hello!",
});

// Speech-to-text
const transcription = await client.createTranscription({
  file: audioBlob,
});

// Text-to-speech
const wav = await client.createSpeech({
  model: "your-tts-model",
  input: "Hello!",
});

// VOICEVOX-compatible TTS
const audioQuery = await client.createTtsAudioQuery({ text: "Hello!", speaker: 1 });
const synthesized = await client.synthesizeTtsSpeech({
  speaker: 1,
  ttsSynthesisRequest: { ...audioQuery, kana: audioQuery.kana ?? "" },
});
```

By default requests go to `https://api.ai.sakura.ad.jp`. Pass `basePath` to override it:

```ts
new AiEngine({ apiKey: "...", basePath: "https://example.com" });
```

## Development

```sh
bun install
bun run build       # build the package (dist/)
bun run lint         # check formatting and lint
bun run lint:fix     # autofix lint issues
bun run format       # format the codebase
bun run typecheck    # type-check with tsc
```

### Regenerating the API client

`src/openapi/*` is generated from upstream OpenAPI specs via [openapi-generator-cli](https://github.com/OpenAPITools/openapi-generator-cli) and is checked into the repository. `src/ai-engine.ts` is a hand-written, user-friendly wrapper on top of it and is not regenerated.

```sh
bun run generate:openapi
```

Requires Java 11+ on `PATH`. Specs are configured in `scripts/generate-openapi.ts`.

## Releasing

This project uses [Changesets](https://github.com/changesets/changesets):

```sh
bun run changeset       # record a change
bun run version         # bump versions and update changelogs
bun run release         # build and publish to npm
```

## License

MIT
