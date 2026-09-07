import { Configuration, DefaultApi } from "./openapi/object-storage";
import type {
  CreateBucketReplicationOperationRequest,
  CreateBucketRequest,
  CreatePermissionKeyRequest,
  CreatePermissionRequest,
  DeleteAccountKeyRequest,
  DeleteBucketEncryptionRequest,
  DeleteBucketReplicationRequest,
  DeleteBucketRequest,
  DeletePermissionKeyRequest,
  DeletePermissionRequest,
  ListBucketMeteringRequest,
  ListBucketReplicableTargetsRequest,
  ListPermissionKeysRequest,
  ReadAccountKeyRequest,
  ReadBucketEncryptionRequest,
  ReadBucketPenaltyRequest,
  ReadBucketPlanRequest,
  ReadBucketQuotaRequest,
  ReadBucketReplicationRequest,
  ReadBucketUsageRequest,
  ReadClusterRequest,
  ReadPermissionKeyRequest,
  ReadPermissionRequest,
  UpdateBucketEncryptionRequest,
  UpdateBucketPlanRequest,
  UpdatePermissionRequest,
} from "./openapi/object-storage";

const FED_BASE_PATH = "https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1";

const siteBasePath = (site: string) =>
  `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/${site}/v2`;

export interface ObjectStorageOptions {
  /** Access token (UUID) issued for the Sakura Object Storage API. Sent as the HTTP Basic auth username. */
  accessToken: string;
  /** Access token secret issued for the Sakura Object Storage API. Sent as the HTTP Basic auth password. */
  accessTokenSecret: string;
  /**
   * Site (cluster) ID that bucket/account/permission operations are scoped to, e.g. `"isk01"`, `"tky01"`,
   * `"arc02"`. Defaults to `"isk01"`. Use {@link listClusters} to discover available sites. Ignored if
   * `siteBasePath` is set.
   */
  site?: string;
  /** Override the federation API base URL. Defaults to `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`. */
  fedBasePath?: string;
  /** Override the site API base URL. Defaults to the `1.0/{site}/v2` endpoint for `site`. */
  siteBasePath?: string;
}

/**
 * User-facing client for the Sakura Object Storage API.
 *
 * Unlike the other Sakura services, this API is split across two base URLs: a "federation" endpoint
 * (site/cluster discovery, bucket create/delete, replication setup) and a per-site endpoint (bucket
 * details, account, permissions, and everything else). openapi-generator's typescript-fetch template
 * doesn't support OpenAPI's per-operation `servers` overrides, so this wrapper keeps two configured
 * {@link DefaultApi} instances internally and routes each method to the right one.
 */
export class ObjectStorage {
  private readonly fed: DefaultApi;
  private readonly site: DefaultApi;

  constructor(options: ObjectStorageOptions) {
    const auth = { username: options.accessToken, password: options.accessTokenSecret };
    this.fed = new DefaultApi(
      new Configuration({ ...auth, basePath: options.fedBasePath ?? FED_BASE_PATH }),
    );
    this.site = new DefaultApi(
      new Configuration({
        ...auth,
        basePath: options.siteBasePath ?? siteBasePath(options.site ?? "isk01"),
      }),
    );
  }

  // --- Federation endpoint: sites and bucket lifecycle ---

  /** List available sites (clusters). */
  listClusters(initOverrides?: RequestInit) {
    return this.fed.listClusters(initOverrides);
  }

  /** Get a site (cluster) by ID. */
  readCluster(request: ReadClusterRequest, initOverrides?: RequestInit) {
    return this.fed.readCluster(request, initOverrides);
  }

  /** Create a bucket on a given site. */
  createBucket(request: CreateBucketRequest, initOverrides?: RequestInit) {
    return this.fed.createBucket(request, initOverrides);
  }

  /** Delete a bucket. */
  deleteBucket(request: DeleteBucketRequest, initOverrides?: RequestInit) {
    return this.fed.deleteBucket(request, initOverrides);
  }

  /** Set up cross-bucket replication. */
  createBucketReplication(
    request: CreateBucketReplicationOperationRequest,
    initOverrides?: RequestInit,
  ) {
    return this.fed.createBucketReplication(request, initOverrides);
  }

  // --- Site endpoint: bucket details, account, and permissions ---

  /** List buckets on the configured site. */
  listBuckets(initOverrides?: RequestInit) {
    return this.site.listBuckets(initOverrides);
  }

  /** Get a bucket's replication configuration. */
  readBucketReplication(request: ReadBucketReplicationRequest, initOverrides?: RequestInit) {
    return this.site.readBucketReplication(request, initOverrides);
  }

  /** Remove a bucket's replication configuration. */
  deleteBucketReplication(request: DeleteBucketReplicationRequest, initOverrides?: RequestInit) {
    return this.site.deleteBucketReplication(request, initOverrides);
  }

  /** List sites a bucket can replicate to. */
  listBucketReplicableTargets(
    request: ListBucketReplicableTargetsRequest,
    initOverrides?: RequestInit,
  ) {
    return this.site.listBucketReplicableTargets(request, initOverrides);
  }

  /** Get a bucket's server-side encryption configuration. */
  readBucketEncryption(request: ReadBucketEncryptionRequest, initOverrides?: RequestInit) {
    return this.site.readBucketEncryption(request, initOverrides);
  }

  /** Update a bucket's server-side encryption configuration. */
  updateBucketEncryption(request: UpdateBucketEncryptionRequest, initOverrides?: RequestInit) {
    return this.site.updateBucketEncryption(request, initOverrides);
  }

  /** Remove a bucket's server-side encryption configuration. */
  deleteBucketEncryption(request: DeleteBucketEncryptionRequest, initOverrides?: RequestInit) {
    return this.site.deleteBucketEncryption(request, initOverrides);
  }

  /** Get a bucket's storage plan. */
  readBucketPlan(request: ReadBucketPlanRequest, initOverrides?: RequestInit) {
    return this.site.readBucketPlan(request, initOverrides);
  }

  /** Change a bucket's storage plan. */
  updateBucketPlan(request: UpdateBucketPlanRequest, initOverrides?: RequestInit) {
    return this.site.updateBucketPlan(request, initOverrides);
  }

  /** Get a bucket's early-deletion / downgrade penalty. */
  readBucketPenalty(request: ReadBucketPenaltyRequest, initOverrides?: RequestInit) {
    return this.site.readBucketPenalty(request, initOverrides);
  }

  /** Get a bucket's current usage. */
  readBucketUsage(request: ReadBucketUsageRequest, initOverrides?: RequestInit) {
    return this.site.readBucketUsage(request, initOverrides);
  }

  /** Get a bucket's quota. */
  readBucketQuota(request: ReadBucketQuotaRequest, initOverrides?: RequestInit) {
    return this.site.readBucketQuota(request, initOverrides);
  }

  /** Get metered usage for a bucket over a time range. */
  listBucketMetering(request: ListBucketMeteringRequest, initOverrides?: RequestInit) {
    return this.site.listBucketMetering(request, initOverrides);
  }

  /** Get the site account. */
  readAccount(initOverrides?: RequestInit) {
    return this.site.readAccount(initOverrides);
  }

  /** Create the site account (required before creating buckets/keys on a site). */
  createAccount(initOverrides?: RequestInit) {
    return this.site.createAccount(initOverrides);
  }

  /** Delete the site account. */
  deleteAccount(initOverrides?: RequestInit) {
    return this.site.deleteAccount(initOverrides);
  }

  /** List the account's S3 access keys. */
  listAccountKeys(initOverrides?: RequestInit) {
    return this.site.listAccountKeys(initOverrides);
  }

  /** Issue a new S3 access key for the account. */
  createAccountKey(initOverrides?: RequestInit) {
    return this.site.createAccountKey(initOverrides);
  }

  /** Get an S3 access key by ID. */
  readAccountKey(request: ReadAccountKeyRequest, initOverrides?: RequestInit) {
    return this.site.readAccountKey(request, initOverrides);
  }

  /** Delete an S3 access key. */
  deleteAccountKey(request: DeleteAccountKeyRequest, initOverrides?: RequestInit) {
    return this.site.deleteAccountKey(request, initOverrides);
  }

  /** List permissions. */
  listPermissions(initOverrides?: RequestInit) {
    return this.site.listPermissions(initOverrides);
  }

  /** Create a permission scoping access to specific buckets. */
  createPermission(request: CreatePermissionRequest, initOverrides?: RequestInit) {
    return this.site.createPermission(request, initOverrides);
  }

  /** Get a permission by ID. */
  readPermission(request: ReadPermissionRequest, initOverrides?: RequestInit) {
    return this.site.readPermission(request, initOverrides);
  }

  /** Update a permission. */
  updatePermission(request: UpdatePermissionRequest, initOverrides?: RequestInit) {
    return this.site.updatePermission(request, initOverrides);
  }

  /** Delete a permission. */
  deletePermission(request: DeletePermissionRequest, initOverrides?: RequestInit) {
    return this.site.deletePermission(request, initOverrides);
  }

  /** List a permission's S3 access keys. */
  listPermissionKeys(request: ListPermissionKeysRequest, initOverrides?: RequestInit) {
    return this.site.listPermissionKeys(request, initOverrides);
  }

  /** Issue a new S3 access key scoped to a permission. */
  createPermissionKey(request: CreatePermissionKeyRequest, initOverrides?: RequestInit) {
    return this.site.createPermissionKey(request, initOverrides);
  }

  /** Get a permission's S3 access key by ID. */
  readPermissionKey(request: ReadPermissionKeyRequest, initOverrides?: RequestInit) {
    return this.site.readPermissionKey(request, initOverrides);
  }

  /** Delete a permission's S3 access key. */
  deletePermissionKey(request: DeletePermissionKeyRequest, initOverrides?: RequestInit) {
    return this.site.deletePermissionKey(request, initOverrides);
  }

  /** Get the site's service status. */
  readStatus(initOverrides?: RequestInit) {
    return this.site.readStatus(initOverrides);
  }

  /** List available storage plans. */
  listPlans(initOverrides?: RequestInit) {
    return this.site.listPlans(initOverrides);
  }

  /** Get the account's quota. */
  readQuota(initOverrides?: RequestInit) {
    return this.site.readQuota(initOverrides);
  }
}

export type {
  CreateBucketReplicationOperationRequest,
  CreateBucketRequest,
  CreatePermissionKeyRequest,
  CreatePermissionRequest,
  DeleteAccountKeyRequest,
  DeleteBucketEncryptionRequest,
  DeleteBucketReplicationRequest,
  DeleteBucketRequest,
  DeletePermissionKeyRequest,
  DeletePermissionRequest,
  ListBucketMeteringRequest,
  ListBucketReplicableTargetsRequest,
  ListPermissionKeysRequest,
  ReadAccountKeyRequest,
  ReadBucketEncryptionRequest,
  ReadBucketPenaltyRequest,
  ReadBucketPlanRequest,
  ReadBucketQuotaRequest,
  ReadBucketReplicationRequest,
  ReadBucketUsageRequest,
  ReadClusterRequest,
  ReadPermissionKeyRequest,
  ReadPermissionRequest,
  UpdateBucketEncryptionRequest,
  UpdateBucketPlanRequest,
  UpdatePermissionRequest,
} from "./openapi/object-storage";
