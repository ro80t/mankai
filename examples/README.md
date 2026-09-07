# Examples

Runnable examples for every client in this package. Each script reads its credentials from
environment variables.

These examples import from `../src/...` for convenience when running inside this repository. In
your own project, install the package and import from `"mankai"` instead.

## AI Engine

```sh
SAKURA_AI_ENGINE_API_KEY=... bun run examples/chat-completion.ts
SAKURA_AI_ENGINE_API_KEY=... bun run examples/embeddings.ts
SAKURA_AI_ENGINE_API_KEY=... bun run examples/message.ts
SAKURA_AI_ENGINE_API_KEY=... bun run examples/response.ts
SAKURA_AI_ENGINE_API_KEY=... bun run examples/transcription.ts <path-to-audio-file>
SAKURA_AI_ENGINE_API_KEY=... bun run examples/speech.ts
SAKURA_AI_ENGINE_API_KEY=... bun run examples/tts.ts
```

## Object Storage

```sh
SAKURA_OBJECT_STORAGE_ACCESS_TOKEN=... SAKURA_OBJECT_STORAGE_ACCESS_TOKEN_SECRET=... bun run examples/object-storage.ts
```

## IAM

```sh
SAKURA_IAM_ACCESS_TOKEN=... bun run examples/iam.ts
```

## SimpleMQ

```sh
SAKURA_SIMPLEMQ_API_KEY=... bun run examples/simple-mq.ts <queue-name>
```
