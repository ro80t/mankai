import { Configuration, DefaultApi } from "./openapi/ai-engine";
import type {
  CreateChatCompletionRequest,
  CreateEmbeddingsRequest,
  CreateMessageRequest,
  CreateResponseRequest,
  CreateTranscriptionRequest,
  CreateTtsAudioQueryRequest,
  EmbeddingResponse,
  SpeechRequest,
  SynthesizeTtsSpeechRequest,
  TranscriptionResponse,
  TtsAudioQuery,
} from "./openapi/ai-engine";

export interface AiEngineOptions {
  /** API key for Sakura AI Engine. Sent as `Authorization: Bearer <apiKey>`. */
  apiKey: string;
  /** Base URL of the API. Defaults to `https://api.ai.sakura.ad.jp`. */
  basePath?: string;
}

/**
 * The generated {@link DefaultApi} leaves `createChatCompletion` / `createMessage` /
 * `createResponse` typed as `void` because the spec doesn't declare a response schema
 * for those endpoints, even though the server does return a JSON body. We surface that
 * body here as loosely-typed JSON instead of silently discarding it.
 */
export type UnspecifiedJsonResponse = Record<string, unknown>;

/**
 * User-facing client for the Sakura AI Engine Inference API.
 *
 * Thin wrapper around the generated {@link DefaultApi} that flattens the
 * double-nested request parameters and surfaces the JSON body even for
 * endpoints whose response schema isn't declared in the spec.
 */
export class AiEngine {
  private readonly api: DefaultApi;

  constructor(options: AiEngineOptions) {
    this.api = new DefaultApi(
      new Configuration({
        basePath: options.basePath,
        accessToken: options.apiKey,
      }),
    );
  }

  /** Create a chat completion (OpenAI Chat Completions compatible). */
  async createChatCompletion(
    request: CreateChatCompletionRequest,
    initOverrides?: RequestInit,
  ): Promise<UnspecifiedJsonResponse> {
    const response = await this.api.createChatCompletionRaw(
      { createChatCompletionRequest: request },
      initOverrides,
    );
    return response.raw.json();
  }

  /** Create a message (Anthropic Messages API compatible). */
  async createMessage(
    request: CreateMessageRequest,
    initOverrides?: RequestInit,
  ): Promise<UnspecifiedJsonResponse> {
    const response = await this.api.createMessageRaw(
      { createMessageRequest: request },
      initOverrides,
    );
    return response.raw.json();
  }

  /** Create a response (OpenAI Responses API compatible). */
  async createResponse(
    request: CreateResponseRequest,
    initOverrides?: RequestInit,
  ): Promise<UnspecifiedJsonResponse> {
    const response = await this.api.createResponseRaw(
      { createResponseRequest: request },
      initOverrides,
    );
    return response.raw.json();
  }

  /** Create embedding vectors. */
  async createEmbeddings(
    request: CreateEmbeddingsRequest,
    initOverrides?: RequestInit,
  ): Promise<EmbeddingResponse> {
    return this.api.createEmbeddings({ createEmbeddingsRequest: request }, initOverrides);
  }

  /** Transcribe an audio file (Speech-to-Text). */
  async createTranscription(
    request: CreateTranscriptionRequest,
    initOverrides?: RequestInit,
  ): Promise<TranscriptionResponse> {
    return this.api.createTranscription(request, initOverrides);
  }

  /** Synthesize speech from text (Text-to-Speech). Returns a WAV Blob. */
  async createSpeech(request: SpeechRequest, initOverrides?: RequestInit): Promise<Blob> {
    return this.api.createSpeech({ speechRequest: request }, initOverrides);
  }

  /** Create a VOICEVOX-compatible TTS audio query. */
  async createTtsAudioQuery(
    request: CreateTtsAudioQueryRequest,
    initOverrides?: RequestInit,
  ): Promise<TtsAudioQuery> {
    return this.api.createTtsAudioQuery(request, initOverrides);
  }

  /** Synthesize speech from a VOICEVOX-compatible TTS audio query. Returns a WAV Blob. */
  async synthesizeTtsSpeech(
    request: SynthesizeTtsSpeechRequest,
    initOverrides?: RequestInit,
  ): Promise<Blob> {
    return this.api.synthesizeTtsSpeech(request, initOverrides);
  }
}

export type {
  ChatCompletionRequestAssistantMessage,
  ChatCompletionRequestDeveloperMessage,
  ChatCompletionRequestSystemMessage,
  ChatCompletionRequestToolMessage,
  ChatCompletionRequestUserMessage,
  CreateChatCompletionRequest,
  CreateEmbeddingsRequest,
  CreateMessageRequest,
  CreateResponseRequest,
  CreateTranscriptionRequest,
  CreateTtsAudioQueryRequest,
  EmbeddingResponse,
  SpeechRequest,
  SynthesizeTtsSpeechRequest,
  TranscriptionResponse,
  TtsAudioQuery,
  TtsSynthesisRequest,
} from "./openapi/ai-engine";
