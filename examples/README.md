# Examples

Runnable examples of the `AiEngine` client. Each script reads the API key from the
`SAKURA_AI_ENGINE_API_KEY` environment variable.

These examples import from `../src/ai-engine` for convenience when running inside this
repository. In your own project, install the package and import from `"mankai"` instead.

```sh
SAKURA_AI_ENGINE_API_KEY=... bun run examples/chat-completion.ts
SAKURA_AI_ENGINE_API_KEY=... bun run examples/embeddings.ts
SAKURA_AI_ENGINE_API_KEY=... bun run examples/message.ts
SAKURA_AI_ENGINE_API_KEY=... bun run examples/response.ts
SAKURA_AI_ENGINE_API_KEY=... bun run examples/transcription.ts <path-to-audio-file>
SAKURA_AI_ENGINE_API_KEY=... bun run examples/speech.ts
SAKURA_AI_ENGINE_API_KEY=... bun run examples/tts.ts
```
