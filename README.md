# mankai

A TypeScript client for the [Sakura AI Engine Inference API](https://manual.sakura.ad.jp/cloud/ai-engine/02-howto.html).

## Installation

```sh
bun add mankai
npm install mankai
yarn add mankai
pnpm add mankai
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

## Examples

Runnable examples for every endpoint live in [`examples/`](examples):

- [`chat-completion.ts`](examples/chat-completion.ts) — Chat Completions
- [`embeddings.ts`](examples/embeddings.ts) — Embeddings
- [`message.ts`](examples/message.ts) — Messages (Anthropic compatible)
- [`response.ts`](examples/response.ts) — Responses (OpenAI compatible)
- [`transcription.ts`](examples/transcription.ts) — Speech-to-text
- [`speech.ts`](examples/speech.ts) — Text-to-speech
- [`tts.ts`](examples/tts.ts) — VOICEVOX-compatible TTS

See [`examples/README.md`](examples/README.md) for how to run them.

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

Releases are automated by [`.github/workflows/release.yml`](.github/workflows/release.yml) via [`changesets/action`](https://github.com/changesets/action):

1. Merging a PR with changesets into `main` makes the workflow open/update a "Version Packages" PR.
2. Merging that PR triggers the workflow again, which builds and publishes to npm.

Publishing uses npm's [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) instead of a long-lived `NPM_TOKEN`. This requires a one-time setup on npmjs.com: on the package's **Settings → Trusted Publisher**, add a GitHub Actions publisher pointing at this repository, workflow file `release.yml`, and (if used) the environment name.

## License

MIT
