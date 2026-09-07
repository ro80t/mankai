import { Configuration, DefaultApi } from "./openapi/simple-notification";
import type {
  CheckNotificationDestinationStatusRequest,
  CreateCommonServiceItemRequest,
  DeleteCommonServiceItemRequest,
  ReadCommonServiceItemRequest,
  ReadNotificationHistoryRequest,
  ReorderNotificationRoutingOperationRequest,
  SendNotificationOperationRequest,
  UpdateCommonServiceItemRequest,
} from "./openapi/simple-notification";

export interface SimpleNotificationOptions {
  /** Access token (UUID) issued via the Sakura Cloud control panel. Sent as the HTTP Basic auth username. */
  accessToken: string;
  /** Access token secret issued via the Sakura Cloud control panel. Sent as the HTTP Basic auth password. */
  accessTokenSecret: string;
  /** Base URL of the API. Defaults to `https://secure.sakura.ad.jp/cloud/zone/is1a/api/cloud/1.1`. */
  basePath?: string;
}

/**
 * User-facing client for the Sakura Simple Notification (シンプル通知) API.
 *
 * The upstream OpenAPI spec doesn't declare a `securitySchemes` section, so the generated client sends
 * no `Authorization` header at all even though the API requires the same HTTP Basic auth (access
 * token / access token secret) as the rest of Sakura Cloud's API. This wrapper adds that header itself
 * via middleware instead of relying on generated auth code.
 */
export class SimpleNotification {
  private readonly api: DefaultApi;

  constructor(options: SimpleNotificationOptions) {
    const credentials = btoa(`${options.accessToken}:${options.accessTokenSecret}`);
    this.api = new DefaultApi(new Configuration({ basePath: options.basePath })).withPreMiddleware(
      async (context) => ({
        url: context.url,
        init: {
          ...context.init,
          headers: { ...context.init.headers, Authorization: `Basic ${credentials}` },
        },
      }),
    );
  }

  /** Send a notification through a configured destination. */
  sendNotification(request: SendNotificationOperationRequest, initOverrides?: RequestInit) {
    return this.api.sendNotification(request, initOverrides);
  }

  /** Check whether a notification destination is currently able to receive notifications. */
  checkNotificationDestinationStatus(
    request: CheckNotificationDestinationStatusRequest,
    initOverrides?: RequestInit,
  ) {
    return this.api.checkNotificationDestinationStatus(request, initOverrides);
  }

  /** List available notification sources (event senders that can route to a destination). */
  listNotificationSources(initOverrides?: RequestInit) {
    return this.api.listNotificationSources(initOverrides);
  }

  /** List notification send history. */
  listNotificationHistories(initOverrides?: RequestInit) {
    return this.api.listNotificationHistories(initOverrides);
  }

  /** Get a single notification send history entry by request ID. */
  readNotificationHistory(request: ReadNotificationHistoryRequest, initOverrides?: RequestInit) {
    return this.api.readNotificationHistory(request, initOverrides);
  }

  /** Reorder notification routing rules. */
  reorderNotificationRouting(
    request: ReorderNotificationRoutingOperationRequest,
    initOverrides?: RequestInit,
  ) {
    return this.api.reorderNotificationRouting(request, initOverrides);
  }

  /** List notification destinations (common service items). */
  listCommonServiceItems(initOverrides?: RequestInit) {
    return this.api.listCommonServiceItems(initOverrides);
  }

  /** Create a notification destination. */
  createCommonServiceItem(request: CreateCommonServiceItemRequest, initOverrides?: RequestInit) {
    return this.api.createCommonServiceItem(request, initOverrides);
  }

  /** Get a notification destination by ID. */
  readCommonServiceItem(request: ReadCommonServiceItemRequest, initOverrides?: RequestInit) {
    return this.api.readCommonServiceItem(request, initOverrides);
  }

  /** Update a notification destination. */
  updateCommonServiceItem(request: UpdateCommonServiceItemRequest, initOverrides?: RequestInit) {
    return this.api.updateCommonServiceItem(request, initOverrides);
  }

  /** Delete a notification destination. */
  deleteCommonServiceItem(request: DeleteCommonServiceItemRequest, initOverrides?: RequestInit) {
    return this.api.deleteCommonServiceItem(request, initOverrides);
  }
}

export type {
  CheckNotificationDestinationStatusRequest,
  CreateCommonServiceItemRequest,
  DeleteCommonServiceItemRequest,
  ReadCommonServiceItemRequest,
  ReadNotificationHistoryRequest,
  ReorderNotificationRoutingOperationRequest,
  SendNotificationOperationRequest,
  UpdateCommonServiceItemRequest,
} from "./openapi/simple-notification";
