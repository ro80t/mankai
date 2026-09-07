import { Configuration, DefaultApi } from "./openapi/simple-mq";
import type {
  DeleteMessageRequest,
  ExtendMessageTimeoutRequest,
  ReceiveMessageRequest,
  SendMessageRequest,
} from "./openapi/simple-mq";

export interface SimpleMqOptions {
  /** Per-queue API key issued when the queue was created. Sent as `Authorization: Bearer <apiKey>`. */
  apiKey: string;
  /** Base URL of the API. Defaults to `https://simplemq.tk1b.api.sacloud.jp`. */
  basePath?: string;
}

/** User-facing client for the Sakura SimpleMQ data-plane API (enqueue/dequeue messages). */
export class SimpleMq {
  private readonly api: DefaultApi;

  constructor(options: SimpleMqOptions) {
    this.api = new DefaultApi(
      new Configuration({ basePath: options.basePath, accessToken: options.apiKey }),
    );
  }

  /** Enqueue a message onto a queue. */
  sendMessage(request: SendMessageRequest, initOverrides?: RequestInit) {
    return this.api.sendMessage(request, initOverrides);
  }

  /** Dequeue (receive) message(s) from a queue. */
  receiveMessage(request: ReceiveMessageRequest, initOverrides?: RequestInit) {
    return this.api.receiveMessage(request, initOverrides);
  }

  /** Extend a received message's visibility timeout. */
  extendMessageTimeout(request: ExtendMessageTimeoutRequest, initOverrides?: RequestInit) {
    return this.api.extendMessageTimeout(request, initOverrides);
  }

  /** Acknowledge and remove a processed message from the queue. */
  deleteMessage(request: DeleteMessageRequest, initOverrides?: RequestInit) {
    return this.api.deleteMessage(request, initOverrides);
  }
}

export type {
  DeleteMessageRequest,
  ExtendMessageTimeoutRequest,
  ReceiveMessageRequest,
  SendMessageRequest,
} from "./openapi/simple-mq";
