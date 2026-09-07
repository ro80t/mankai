import {
  AuthApi,
  Configuration,
  FolderApi,
  GroupApi,
  IamPolicyApi,
  IamRoleApi,
  IdPolicyApi,
  IdRoleApi,
  OrganizationApi,
  ProjectApi,
  ProjectApikeyApi,
  ScimApi,
  ServicePolicyApi,
  ServicePrincipalApi,
  SsoApi,
  User2faApi,
  UserApi,
} from "./openapi/iam";

export interface IamOptions {
  /**
   * Service principal access token. Sent as `Authorization: Bearer <accessToken>`. This is what most
   * operations expect.
   */
  accessToken?: string;
  /**
   * API key issued via the control panel, used as an alternative to `accessToken` for the handful of
   * operations (e.g. {@link Iam.auth}'s `readAuthContext`) that also accept HTTP Basic auth.
   */
  apiKey?: string;
  /** API key secret, paired with {@link IamOptions.apiKey}. */
  apiSecret?: string;
  /** Base URL of the API. Defaults to `https://secure.sakura.ad.jp/cloud/api/iam/1.0`. */
  basePath?: string;
}

/**
 * User-facing client for the Sakura Cloud IAM API.
 *
 * The generated client is organized into one class per resource (users, groups, projects, ...)
 * rather than a single `DefaultApi` like the other Sakura services. Reshaping ~90 operations into
 * hand-written passthrough methods (as {@link AiEngine} does) wouldn't add much, so this wrapper
 * instead groups the generated per-resource clients under friendly names, all sharing one
 * {@link Configuration}. Each group keeps the generated method names, e.g. `iam.users.listUsers()`.
 */
export class Iam {
  /** Users (`/compat/users`). */
  readonly users: UserApi;
  /** Two-factor auth settings for users. */
  readonly user2fa: User2faApi;
  /** Groups. */
  readonly groups: GroupApi;
  /** Projects. */
  readonly projects: ProjectApi;
  /** Project API keys. */
  readonly projectApiKeys: ProjectApikeyApi;
  /** Folders (project groupings). */
  readonly folders: FolderApi;
  /** Organization settings. */
  readonly organizations: OrganizationApi;
  /** Service principals. */
  readonly servicePrincipals: ServicePrincipalApi;
  /** IAM policies (permission sets attachable to users/groups/service principals). */
  readonly iamPolicies: IamPolicyApi;
  /** IAM roles (bundles of IAM policies). */
  readonly iamRoles: IamRoleApi;
  /** ID federation policies. */
  readonly idPolicies: IdPolicyApi;
  /** ID federation roles. */
  readonly idRoles: IdRoleApi;
  /** Service-level policies. */
  readonly servicePolicies: ServicePolicyApi;
  /** SSO profile configuration. */
  readonly sso: SsoApi;
  /** SCIM provisioning endpoints. */
  readonly scim: ScimApi;
  /** Auth introspection (e.g. `readAuthContext`). */
  readonly auth: AuthApi;

  constructor(options: IamOptions) {
    const configuration = new Configuration({
      basePath: options.basePath,
      accessToken: options.accessToken,
      username: options.apiKey,
      password: options.apiSecret,
    });

    this.users = new UserApi(configuration);
    this.user2fa = new User2faApi(configuration);
    this.groups = new GroupApi(configuration);
    this.projects = new ProjectApi(configuration);
    this.projectApiKeys = new ProjectApikeyApi(configuration);
    this.folders = new FolderApi(configuration);
    this.organizations = new OrganizationApi(configuration);
    this.servicePrincipals = new ServicePrincipalApi(configuration);
    this.iamPolicies = new IamPolicyApi(configuration);
    this.iamRoles = new IamRoleApi(configuration);
    this.idPolicies = new IdPolicyApi(configuration);
    this.idRoles = new IdRoleApi(configuration);
    this.servicePolicies = new ServicePolicyApi(configuration);
    this.sso = new SsoApi(configuration);
    this.scim = new ScimApi(configuration);
    this.auth = new AuthApi(configuration);
  }
}
