/* tslint:disable */
/* eslint-disable */
/**
 * さくらのオブジェクトストレージ APIドキュメント
 *  ---  「さくらのオブジェクトストレージ」が提供するAPIの利用方法とサンプルを公開しております。  # 基本的な使い方  ## APIキーの発行  APIを利用するためには、認証のための「APIキー」が必要です。事前にキーを発行しておきます。 APIキーは「ユーザーID」「パスワード」に相当する「トークン」と呼ばれる認証情報で構成されています。  |   項目名   | APIキー発行時の項目名        | このドキュメント内での例             | |------------|------------------------------|--------------------------------------| | ユーザーID | アクセストークン(UUID)       | 01234567-89ab-cdef-0123-456789abcdef | | パスワード | アクセストークンシークレット | SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM |  <div class=\"warning\"> <b>操作マニュアル</b><br /> <ul><li><a href=\"https://manual.sakura.ad.jp/cloud/api/apikey.html\">APIキー | さくらのクラウド ドキュメント</a></li></ul> </div>  ## 入力パラメータ  APIの入力には送信先URLに対して、いくつかのヘッダーとAPIキーを送信します。  * APIのURLは以下の2つが存在します。※ 各APIの使い分けは後述します。   * `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/(エンドポイント)`   * `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/(エンドポイント)` * 認証方式はHTTP Basic認証です。APIキーのアクセストークンをユーザーID、アクセストークンシークレットをパスワードとして指定します。  ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      \'https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters\' ```  ## 出力結果と応答コード（HTTPステータスコード）  APIからの結果は、「応答コード（HTTPステータスコード）」と、「JSON形式(UTF-8)の結果」として出力されます。  応答コードは、リクエストが成功したのか、失敗したのか大まかな情報を判断することができるもので、例えば失敗したときには、なぜこのような結果になったのかなど、具体的な情報は応答コードと主に返された本文を見ることで把握することができます。  | 結果                                | 応答コード/status   | |-------------------------------------|---------------------| | 成功（要求を受け付けた）             | 2xx                 | | 失敗（要求が受け付けられなかった）  | 4xx, 5xx            |  ``` # 出力結果サンプル（レスポンスボディー） {   \"error\": {     \"code\": 404,     \"errors\": [       {         \"domain\": \"fed.objectstorage.sacloud\",         \"location\": \"clusters\",         \"location_type\": \"path_parameter\",         \"message\": \"Cluster was not found\",         \"reason\": \"not_found\"       }     ],     \"message\": \"Cluster was not found\",     \"trace_id\": \"0f36837633984f3fc8871f515e8efa24\"   } } ```  # 利用例  ## 1.接続先サイト一覧の取得  さくらのオブジェクトストレージを利用するには、まずバケット作成先となる**サイト**を取得・選択します。  サイト一覧を取得するには、以下のような入力を行います。  ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      \'https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters\' ```  実行結果として、サイトのリストが返却されます。  ``` # 出力結果サンプル {   \"data\": [     {       \"api_zone\": [],       \"control_panel_url\": \"https://secure.sakura.ad.jp/objectstorage/\",       \"display_name_en_us\": \"Ishikari Site #1\",       \"display_name_ja\": \"石狩第1サイト\",       \"display_name\": \"石狩第1サイト\",       \"display_order\": 1,       \"endpoint_base\": \"isk01.sakurastorage.jp\",       \"id\": \"isk01\",       \"region\": \"jp-north-1\",       \"s3_endpoint\": \"s3.isk01.sakurastorage.jp\",       \"s3_endpoint_for_control_panel\": \"s3.cp.isk01.sakurastorage.jp\",       \"storage_zone\": []     }   ] } ```  得られたサイトID（上記の`id`フィールド）を確認します。これは後続の利用例で使用します。  ## 2.サイトアカウントの作成  上記のサイトから利用したいサイトIDを選択し（ここではisk01を選択することにします）、**サイトアカウント**を作成します。  サイトアカウントとは、サイトを利用するための独立したアカウントであり、サイトアカウント作成・削除による料金の発生はございません。 なお、すでにサイトアカウントを作成済みの場合は、再度サイトアカウントの作成は不要です。  サイトアカウントを作成するには以下のような入力を行います。  ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X POST \\      https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/isk01/v2/account ```  サイトアカウントの作成が完了すると、選択したサイトにて  * バケットの作成・削除 * アクセスキーの発行・削除 * パーミッションキーの発行・削除  などの操作が可能になります。  ## 3.バケットの作成・削除  選択したサイトにてサイトアカウントを作成後、**バケット**の作成・削除が可能です。  バケットを作成するには以下のような入力を行います。 この時、選択したサイト（ここではisk01とします）をリクエストボディーに入れ、作成したいバケット名をパスパラメータに入れる必要があります。  ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X PUT \\      -d \'{\"cluster_id\": \"isk01\"}\' \\      https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/buckets/sample ```  上記で作成したバケットを削除するには以下のような入力を行います。  ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X DELETE \\      https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/buckets/sample ```  ## 4.アクセスキーの発行・削除  選択したサイトにてサイトアカウントを作成後、**アクセスキー**の発行・削除が可能です。  アクセスキーを発行するには以下のような入力を行います。  ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X POST \\      https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/isk01/v2/account/keys ```  コマンド結果には以下のフィールドが含まれます。  * `created_at` : 作成日時 * `id` : アクセスキーID * `secret` : シークレットアクセスキー  ``` # 出力結果サンプル {   \"data\": {     \"created_at\": \"2021-11-04T07:42:41.121418479Z\",     \"id\": \"XPJK4SC9883N91RHR253\",     \"secret\": \"jqRaUo5l+EiEYqP8wos9exbmFfq4/vG8CLPYI2XN\"   } } ```  上記で作成したアクセスキーを削除するには以下のような入力を行います。 この時、削除したいアクセスキーIDをパスパラメータに入れる必要があります。  ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X DELETE \\      https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/isk01/v2/account/keys/XPJK4SC9883N91RHR253 ```  ## 5.パーミッション及びパーミッションアクセスキーの発行・削除  選択したサイトにてサイトアカウントを作成後且つバケットが1つ以上ある場合、**パーミッション**の発行・削除が可能です。  パーミッションを作成するには以下のような入力を行います。 この時、パーミッション名、パーミッションで制御したいバケットとそれに対する操作をリクエストボディーに入れる必要があります。  ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X POST \\      -d \'{\"display_name\": \"sample_permission\", \"bucket_controls\": [{\"bucket_name\": \"sample\", \"can_read\": true, \"can_write\": true}]}\' \\      https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/isk01/v2/permissions ```  作成が完了すると、パーミッションIDが含まれたレスポンスを受け取ります。 ``` # 出力サンプル {   \"data\": {     \"bucket_controls\": [       {         \"bucket_name\":\"sample\",         \"can_read\":true,         \"can_write\":true,         \"created_at\":\"2021-11-11T13:36:08.767118492Z\"       }     ],     \"created_at\":\"2021-11-11T13:36:08.690384415Z\",     \"display_name\":\"sample_permission\",     \"id\":619   } } ```  このパーミッションのアクセスキーを発行するには以下のような入力を行います。 この時、パーミッション作成時に発行されたID（ここでは619とします）をパスパラメータに含める必要があります。  ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X POST \\      https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/isk01/v2/permissions/619/keys ```  コマンド結果には以下のフィールドが含まれます。  * `created_at` : 作成日時 * `id` : アクセスキーID * `secret` : シークレットアクセスキー  ``` # 出力結果サンプル {   \"data\": {     \"created_at\": \"2021-11-04T07:42:41.121418479Z\",     \"id\": \"XPJK4SC9883N91RHR253\",     \"secret\": \"jqRaUo5l+EiEYqP8wos9exbmFfq4/vG8CLPYI2XN\"   } } ```  パーミッションアクセスキーを削除するには以下のような入力を行います。 この時、パーミッションアクセスキー発行時に出力されたIDをパスパラメータに含める必要があります。 ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X DELETE \\      https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/isk01/v2/permissions/619/keys/XPJK4SC9883N91RHR253 ```  パーミッションを削除するには以下のような入力を行います。 この時、パーミッション作成時に発行されたID（ここでは619とします）をパスパラメータに含める必要があります。  ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X DELETE \\      https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/isk01/v2/permissions/619 ``` ----
 *
 * The version of the OpenAPI document: 1.7.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from '../runtime';
import {
    type Account,
    AccountFromJSON,
    AccountToJSON,
} from '../models/Account';
import {
    type AccountKey,
    AccountKeyFromJSON,
    AccountKeyToJSON,
} from '../models/AccountKey';
import {
    type AccountKeys,
    AccountKeysFromJSON,
    AccountKeysToJSON,
} from '../models/AccountKeys';
import {
    type BucketPenalty,
    BucketPenaltyFromJSON,
    BucketPenaltyToJSON,
} from '../models/BucketPenalty';
import {
    type BucketQuota,
    BucketQuotaFromJSON,
    BucketQuotaToJSON,
} from '../models/BucketQuota';
import {
    type BucketUsage,
    BucketUsageFromJSON,
    BucketUsageToJSON,
} from '../models/BucketUsage';
import {
    type CreateBucketReplicationRequest,
    CreateBucketReplicationRequestFromJSON,
    CreateBucketReplicationRequestToJSON,
} from '../models/CreateBucketReplicationRequest';
import {
    type Error400,
    Error400FromJSON,
    Error400ToJSON,
} from '../models/Error400';
import {
    type Error401,
    Error401FromJSON,
    Error401ToJSON,
} from '../models/Error401';
import {
    type Error403,
    Error403FromJSON,
    Error403ToJSON,
} from '../models/Error403';
import {
    type Error404,
    Error404FromJSON,
    Error404ToJSON,
} from '../models/Error404';
import {
    type Error405,
    Error405FromJSON,
    Error405ToJSON,
} from '../models/Error405';
import {
    type Error409,
    Error409FromJSON,
    Error409ToJSON,
} from '../models/Error409';
import {
    type ErrorDefault,
    ErrorDefaultFromJSON,
    ErrorDefaultToJSON,
} from '../models/ErrorDefault';
import {
    type HandlerCreateBucketReplicationResponse,
    HandlerCreateBucketReplicationResponseFromJSON,
    HandlerCreateBucketReplicationResponseToJSON,
} from '../models/HandlerCreateBucketReplicationResponse';
import {
    type HandlerCreateBucketRequestBody,
    HandlerCreateBucketRequestBodyFromJSON,
    HandlerCreateBucketRequestBodyToJSON,
} from '../models/HandlerCreateBucketRequestBody';
import {
    type HandlerCreateBucketResponse,
    HandlerCreateBucketResponseFromJSON,
    HandlerCreateBucketResponseToJSON,
} from '../models/HandlerCreateBucketResponse';
import {
    type HandlerCreatePermissionKeyResponse,
    HandlerCreatePermissionKeyResponseFromJSON,
    HandlerCreatePermissionKeyResponseToJSON,
} from '../models/HandlerCreatePermissionKeyResponse';
import {
    type HandlerListBucketReplicableTargetsResponse,
    HandlerListBucketReplicableTargetsResponseFromJSON,
    HandlerListBucketReplicableTargetsResponseToJSON,
} from '../models/HandlerListBucketReplicableTargetsResponse';
import {
    type HandlerListBucketsResponse,
    HandlerListBucketsResponseFromJSON,
    HandlerListBucketsResponseToJSON,
} from '../models/HandlerListBucketsResponse';
import {
    type HandlerListClustersResponse,
    HandlerListClustersResponseFromJSON,
    HandlerListClustersResponseToJSON,
} from '../models/HandlerListClustersResponse';
import {
    type HandlerListPermissionKeysResponse,
    HandlerListPermissionKeysResponseFromJSON,
    HandlerListPermissionKeysResponseToJSON,
} from '../models/HandlerListPermissionKeysResponse';
import {
    type HandlerReadBucketReplicationResponse,
    HandlerReadBucketReplicationResponseFromJSON,
    HandlerReadBucketReplicationResponseToJSON,
} from '../models/HandlerReadBucketReplicationResponse';
import {
    type HandlerReadClusterResponse,
    HandlerReadClusterResponseFromJSON,
    HandlerReadClusterResponseToJSON,
} from '../models/HandlerReadClusterResponse';
import {
    type HandlerReadPermissionKeyResponse,
    HandlerReadPermissionKeyResponseFromJSON,
    HandlerReadPermissionKeyResponseToJSON,
} from '../models/HandlerReadPermissionKeyResponse';
import {
    type HandlerUpdateBucketEncryptionRequestBody,
    HandlerUpdateBucketEncryptionRequestBodyFromJSON,
    HandlerUpdateBucketEncryptionRequestBodyToJSON,
} from '../models/HandlerUpdateBucketEncryptionRequestBody';
import {
    type ListBucketMetering200Response,
    ListBucketMetering200ResponseFromJSON,
    ListBucketMetering200ResponseToJSON,
} from '../models/ListBucketMetering200Response';
import {
    type ListPlans200Response,
    ListPlans200ResponseFromJSON,
    ListPlans200ResponseToJSON,
} from '../models/ListPlans200Response';
import {
    type Permission,
    PermissionFromJSON,
    PermissionToJSON,
} from '../models/Permission';
import {
    type PermissionBucketControlsBody,
    PermissionBucketControlsBodyFromJSON,
    PermissionBucketControlsBodyToJSON,
} from '../models/PermissionBucketControlsBody';
import {
    type Permissions,
    PermissionsFromJSON,
    PermissionsToJSON,
} from '../models/Permissions';
import {
    type PlanChangeReqBody,
    PlanChangeReqBodyFromJSON,
    PlanChangeReqBodyToJSON,
} from '../models/PlanChangeReqBody';
import {
    type Quota,
    QuotaFromJSON,
    QuotaToJSON,
} from '../models/Quota';
import {
    type ReadAccountKey,
    ReadAccountKeyFromJSON,
    ReadAccountKeyToJSON,
} from '../models/ReadAccountKey';
import {
    type ReadBucketEncryption200Response,
    ReadBucketEncryption200ResponseFromJSON,
    ReadBucketEncryption200ResponseToJSON,
} from '../models/ReadBucketEncryption200Response';
import {
    type ReadBucketPlan200Response,
    ReadBucketPlan200ResponseFromJSON,
    ReadBucketPlan200ResponseToJSON,
} from '../models/ReadBucketPlan200Response';
import {
    type Status,
    StatusFromJSON,
    StatusToJSON,
} from '../models/Status';
import {
    type UpdateBucketEncryption200Response,
    UpdateBucketEncryption200ResponseFromJSON,
    UpdateBucketEncryption200ResponseToJSON,
} from '../models/UpdateBucketEncryption200Response';
import {
    type UpdateBucketPlan200Response,
    UpdateBucketPlan200ResponseFromJSON,
    UpdateBucketPlan200ResponseToJSON,
} from '../models/UpdateBucketPlan200Response';

export interface CreateBucketRequest {
    name: string;
    handlerCreateBucketRequestBody: HandlerCreateBucketRequestBody;
}

export interface CreateBucketReplicationOperationRequest {
    name: string;
    createBucketReplicationRequest: CreateBucketReplicationRequest;
}

export interface CreatePermissionRequest {
    permissionBucketControlsBody: PermissionBucketControlsBody;
}

export interface CreatePermissionKeyRequest {
    id: number;
}

export interface DeleteAccountKeyRequest {
    id: string;
}

export interface DeleteBucketRequest {
    name: string;
}

export interface DeleteBucketEncryptionRequest {
    name: string;
}

export interface DeleteBucketReplicationRequest {
    name: string;
}

export interface DeletePermissionRequest {
    id: number;
}

export interface DeletePermissionKeyRequest {
    id: number;
    keyId: string;
}

export interface ListBucketMeteringRequest {
    name: string;
    from: Date;
    to: Date;
}

export interface ListBucketReplicableTargetsRequest {
    name: string;
}

export interface ListPermissionKeysRequest {
    id: number;
}

export interface ReadAccountKeyRequest {
    id: string;
}

export interface ReadBucketEncryptionRequest {
    name: string;
}

export interface ReadBucketPenaltyRequest {
    name: string;
}

export interface ReadBucketPlanRequest {
    name: string;
}

export interface ReadBucketQuotaRequest {
    name: string;
}

export interface ReadBucketReplicationRequest {
    name: string;
}

export interface ReadBucketUsageRequest {
    name: string;
}

export interface ReadClusterRequest {
    id: string;
}

export interface ReadPermissionRequest {
    id: number;
}

export interface ReadPermissionKeyRequest {
    id: number;
    keyId: string;
}

export interface UpdateBucketEncryptionRequest {
    name: string;
    handlerUpdateBucketEncryptionRequestBody: HandlerUpdateBucketEncryptionRequestBody;
}

export interface UpdateBucketPlanRequest {
    name: string;
    planChangeReqBody: PlanChangeReqBody;
}

export interface UpdatePermissionRequest {
    id: number;
    permissionBucketControlsBody: PermissionBucketControlsBody;
}

/**
 * DefaultApi - interface
 * 
 * @export
 * @interface DefaultApiInterface
 */
export interface DefaultApiInterface {
    /**
     * Creates request options for createAccount without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createAccountRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary サイトアカウントの作成
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createAccountRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Account>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントの作成
     */
    createAccount(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Account>;

    /**
     * Creates request options for createAccountKey without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createAccountKeyRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary サイトアカウントのアクセスキーの発行
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createAccountKeyRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccountKey>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの発行
     */
    createAccountKey(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccountKey>;

    /**
     * Creates request options for createBucket without sending the request
     * @param {string} name バケット名
     * @param {HandlerCreateBucketRequestBody} handlerCreateBucketRequestBody 作成したいバケット情報
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createBucketRequestOpts(requestParameters: CreateBucketRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * @summary バケットの作成
     * @param {string} name バケット名
     * @param {HandlerCreateBucketRequestBody} handlerCreateBucketRequestBody 作成したいバケット情報
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createBucketRaw(requestParameters: CreateBucketRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerCreateBucketResponse>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットの作成
     */
    createBucket(requestParameters: CreateBucketRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerCreateBucketResponse>;

    /**
     * Creates request options for createBucketReplication without sending the request
     * @param {string} name バケット名
     * @param {CreateBucketReplicationRequest} createBucketReplicationRequest 
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createBucketReplicationRequestOpts(requestParameters: CreateBucketReplicationOperationRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * @summary バケットのレプリケーション設定の作成
     * @param {string} name バケット名
     * @param {CreateBucketReplicationRequest} createBucketReplicationRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createBucketReplicationRaw(requestParameters: CreateBucketReplicationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerCreateBucketReplicationResponse>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットのレプリケーション設定の作成
     */
    createBucketReplication(requestParameters: CreateBucketReplicationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerCreateBucketReplicationResponse>;

    /**
     * Creates request options for createPermission without sending the request
     * @param {PermissionBucketControlsBody} permissionBucketControlsBody どのバケットを制御するかを定義します。
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createPermissionRequestOpts(requestParameters: CreatePermissionRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary パーミッションの作成
     * @param {PermissionBucketControlsBody} permissionBucketControlsBody どのバケットを制御するかを定義します。
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createPermissionRaw(requestParameters: CreatePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Permission>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションの作成
     */
    createPermission(requestParameters: CreatePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Permission>;

    /**
     * Creates request options for createPermissionKey without sending the request
     * @param {number} id パーミッションID
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createPermissionKeyRequestOpts(requestParameters: CreatePermissionKeyRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary パーミッションのアクセスキーの発行
     * @param {number} id パーミッションID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    createPermissionKeyRaw(requestParameters: CreatePermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerCreatePermissionKeyResponse>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションのアクセスキーの発行
     */
    createPermissionKey(requestParameters: CreatePermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerCreatePermissionKeyResponse>;

    /**
     * Creates request options for deleteAccount without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deleteAccountRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary サイトアカウントの削除
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deleteAccountRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントの削除
     */
    deleteAccount(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for deleteAccountKey without sending the request
     * @param {string} id アクセスキーID
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deleteAccountKeyRequestOpts(requestParameters: DeleteAccountKeyRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary サイトアカウントのアクセスキーの削除
     * @param {string} id アクセスキーID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deleteAccountKeyRaw(requestParameters: DeleteAccountKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの削除
     */
    deleteAccountKey(requestParameters: DeleteAccountKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for deleteBucket without sending the request
     * @param {string} name バケット名
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deleteBucketRequestOpts(requestParameters: DeleteBucketRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * @summary バケットの削除
     * @param {string} name バケット名
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deleteBucketRaw(requestParameters: DeleteBucketRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットの削除
     */
    deleteBucket(requestParameters: DeleteBucketRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for deleteBucketEncryption without sending the request
     * @param {string} name バケット名
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deleteBucketEncryptionRequestOpts(requestParameters: DeleteBucketEncryptionRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary バケット暗号化設定の削除（無効化）
     * @param {string} name バケット名
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deleteBucketEncryptionRaw(requestParameters: DeleteBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット暗号化設定の削除（無効化）
     */
    deleteBucketEncryption(requestParameters: DeleteBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for deleteBucketReplication without sending the request
     * @param {string} name バケット名
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deleteBucketReplicationRequestOpts(requestParameters: DeleteBucketReplicationRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * @summary レプリケーション設定の削除
     * @param {string} name バケット名
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deleteBucketReplicationRaw(requestParameters: DeleteBucketReplicationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * レプリケーション設定の削除
     */
    deleteBucketReplication(requestParameters: DeleteBucketReplicationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for deletePermission without sending the request
     * @param {number} id パーミッションID
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deletePermissionRequestOpts(requestParameters: DeletePermissionRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary パーミッションの削除
     * @param {number} id パーミッションID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deletePermissionRaw(requestParameters: DeletePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションの削除
     */
    deletePermission(requestParameters: DeletePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for deletePermissionKey without sending the request
     * @param {number} id パーミッションID
     * @param {string} keyId パーミッションが保有するアクセスキーID
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deletePermissionKeyRequestOpts(requestParameters: DeletePermissionKeyRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary パーミッションが保有するアクセスキーの削除
     * @param {number} id パーミッションID
     * @param {string} keyId パーミッションが保有するアクセスキーID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    deletePermissionKeyRaw(requestParameters: DeletePermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションが保有するアクセスキーの削除
     */
    deletePermissionKey(requestParameters: DeletePermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for listAccountKeys without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listAccountKeysRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary サイトアカウントのアクセスキーの取得
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listAccountKeysRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccountKeys>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの取得
     */
    listAccountKeys(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccountKeys>;

    /**
     * Creates request options for listBucketMetering without sending the request
     * @param {string} name バケット名
     * @param {Date} from 範囲の開始月
     * @param {Date} to 範囲の終了月
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listBucketMeteringRequestOpts(requestParameters: ListBucketMeteringRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。  指定したバケットの使用量を、指定した月範囲で取得します。 取得できるデータは月次集計データとなり、日次や時間毎の詳細なデータは取得できません。 また、指定した月においてバケットの使用が無かった場合でも、ゼロ埋めされたデータが返却されます。
     * @summary バケット使用量の取得
     * @param {string} name バケット名
     * @param {Date} from 範囲の開始月
     * @param {Date} to 範囲の終了月
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listBucketMeteringRaw(requestParameters: ListBucketMeteringRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListBucketMetering200Response>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。  指定したバケットの使用量を、指定した月範囲で取得します。 取得できるデータは月次集計データとなり、日次や時間毎の詳細なデータは取得できません。 また、指定した月においてバケットの使用が無かった場合でも、ゼロ埋めされたデータが返却されます。
     * バケット使用量の取得
     */
    listBucketMetering(requestParameters: ListBucketMeteringRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListBucketMetering200Response>;

    /**
     * Creates request options for listBucketReplicableTargets without sending the request
     * @param {string} name バケット名
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listBucketReplicableTargetsRequestOpts(requestParameters: ListBucketReplicableTargetsRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * @summary バケットのレプリケーション設定可能なディスティネーションバケットを取得
     * @param {string} name バケット名
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listBucketReplicableTargetsRaw(requestParameters: ListBucketReplicableTargetsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerListBucketReplicableTargetsResponse>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットのレプリケーション設定可能なディスティネーションバケットを取得
     */
    listBucketReplicableTargets(requestParameters: ListBucketReplicableTargetsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerListBucketReplicableTargetsResponse>;

    /**
     * Creates request options for listBuckets without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listBucketsRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary バケット一覧の取得
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listBucketsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerListBucketsResponse>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット一覧の取得
     */
    listBuckets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerListBucketsResponse>;

    /**
     * Creates request options for listClusters without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listClustersRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * @summary サイト一覧の取得
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listClustersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerListClustersResponse>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * サイト一覧の取得
     */
    listClusters(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerListClustersResponse>;

    /**
     * Creates request options for listPermissionKeys without sending the request
     * @param {number} id パーミッションID
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listPermissionKeysRequestOpts(requestParameters: ListPermissionKeysRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary パーミッションが保有するアクセスキー一覧の取得
     * @param {number} id パーミッションID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listPermissionKeysRaw(requestParameters: ListPermissionKeysRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerListPermissionKeysResponse>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションが保有するアクセスキー一覧の取得
     */
    listPermissionKeys(requestParameters: ListPermissionKeysRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerListPermissionKeysResponse>;

    /**
     * Creates request options for listPermissions without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listPermissionsRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary パーミッション一覧の取得
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listPermissionsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Permissions>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッション一覧の取得
     */
    listPermissions(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Permissions>;

    /**
     * Creates request options for listPlans without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listPlansRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary 利用可能なプランの一覧取得
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    listPlansRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListPlans200Response>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * 利用可能なプランの一覧取得
     */
    listPlans(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListPlans200Response>;

    /**
     * Creates request options for readAccount without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readAccountRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary サイトアカウントの取得
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readAccountRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Account>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントの取得
     */
    readAccount(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Account>;

    /**
     * Creates request options for readAccountKey without sending the request
     * @param {string} id アクセスキーID
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readAccountKeyRequestOpts(requestParameters: ReadAccountKeyRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary サイトアカウントのアクセスキーの取得
     * @param {string} id アクセスキーID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readAccountKeyRaw(requestParameters: ReadAccountKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ReadAccountKey>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの取得
     */
    readAccountKey(requestParameters: ReadAccountKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ReadAccountKey>;

    /**
     * Creates request options for readBucketEncryption without sending the request
     * @param {string} name バケット名
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketEncryptionRequestOpts(requestParameters: ReadBucketEncryptionRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary バケット暗号化設定の取得
     * @param {string} name バケット名
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketEncryptionRaw(requestParameters: ReadBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ReadBucketEncryption200Response>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット暗号化設定の取得
     */
    readBucketEncryption(requestParameters: ReadBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ReadBucketEncryption200Response>;

    /**
     * Creates request options for readBucketPenalty without sending the request
     * @param {string} name バケット名
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketPenaltyRequestOpts(requestParameters: ReadBucketPenaltyRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary バケットのペナルティ状況を取得
     * @param {string} name バケット名
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketPenaltyRaw(requestParameters: ReadBucketPenaltyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BucketPenalty>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケットのペナルティ状況を取得
     */
    readBucketPenalty(requestParameters: ReadBucketPenaltyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BucketPenalty>;

    /**
     * Creates request options for readBucketPlan without sending the request
     * @param {string} name バケット名
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketPlanRequestOpts(requestParameters: ReadBucketPlanRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary 現在のプランを取得
     * @param {string} name バケット名
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketPlanRaw(requestParameters: ReadBucketPlanRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ReadBucketPlan200Response>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * 現在のプランを取得
     */
    readBucketPlan(requestParameters: ReadBucketPlanRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ReadBucketPlan200Response>;

    /**
     * Creates request options for readBucketQuota without sending the request
     * @param {string} name バケット名
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketQuotaRequestOpts(requestParameters: ReadBucketQuotaRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary バケットの制限値を取得
     * @param {string} name バケット名
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketQuotaRaw(requestParameters: ReadBucketQuotaRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BucketQuota>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケットの制限値を取得
     */
    readBucketQuota(requestParameters: ReadBucketQuotaRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BucketQuota>;

    /**
     * Creates request options for readBucketReplication without sending the request
     * @param {string} name バケット名
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketReplicationRequestOpts(requestParameters: ReadBucketReplicationRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * @summary バケットのレプリケーション設定の取得
     * @param {string} name バケット名
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketReplicationRaw(requestParameters: ReadBucketReplicationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerReadBucketReplicationResponse>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットのレプリケーション設定の取得
     */
    readBucketReplication(requestParameters: ReadBucketReplicationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerReadBucketReplicationResponse>;

    /**
     * Creates request options for readBucketUsage without sending the request
     * @param {string} name バケット名
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketUsageRequestOpts(requestParameters: ReadBucketUsageRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary バケットの使用量を取得
     * @param {string} name バケット名
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readBucketUsageRaw(requestParameters: ReadBucketUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BucketUsage>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケットの使用量を取得
     */
    readBucketUsage(requestParameters: ReadBucketUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BucketUsage>;

    /**
     * Creates request options for readCluster without sending the request
     * @param {string} id サイトID
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readClusterRequestOpts(requestParameters: ReadClusterRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * @summary サイトの取得
     * @param {string} id サイトID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readClusterRaw(requestParameters: ReadClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerReadClusterResponse>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * サイトの取得
     */
    readCluster(requestParameters: ReadClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerReadClusterResponse>;

    /**
     * Creates request options for readPermission without sending the request
     * @param {number} id パーミッションID
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readPermissionRequestOpts(requestParameters: ReadPermissionRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary パーミッションの取得
     * @param {number} id パーミッションID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readPermissionRaw(requestParameters: ReadPermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Permission>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションの取得
     */
    readPermission(requestParameters: ReadPermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Permission>;

    /**
     * Creates request options for readPermissionKey without sending the request
     * @param {number} id パーミッションID
     * @param {string} keyId パーミッションが保有するアクセスキーID
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readPermissionKeyRequestOpts(requestParameters: ReadPermissionKeyRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary パーミッションが保有するアクセスキーの取得
     * @param {number} id パーミッションID
     * @param {string} keyId パーミッションが保有するアクセスキーID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readPermissionKeyRaw(requestParameters: ReadPermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerReadPermissionKeyResponse>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションが保有するアクセスキーの取得
     */
    readPermissionKey(requestParameters: ReadPermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerReadPermissionKeyResponse>;

    /**
     * Creates request options for readQuota without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readQuotaRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary 全体制限値の取得
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readQuotaRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Quota>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * 全体制限値の取得
     */
    readQuota(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Quota>;

    /**
     * Creates request options for readStatus without sending the request
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readStatusRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary サイトのステータスの取得
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    readStatusRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Status>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトのステータスの取得
     */
    readStatus(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Status>;

    /**
     * Creates request options for updateBucketEncryption without sending the request
     * @param {string} name バケット名
     * @param {HandlerUpdateBucketEncryptionRequestBody} handlerUpdateBucketEncryptionRequestBody 
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    updateBucketEncryptionRequestOpts(requestParameters: UpdateBucketEncryptionRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary バケット暗号化設定の作成（KMSキー指定）
     * @param {string} name バケット名
     * @param {HandlerUpdateBucketEncryptionRequestBody} handlerUpdateBucketEncryptionRequestBody 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    updateBucketEncryptionRaw(requestParameters: UpdateBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpdateBucketEncryption200Response>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット暗号化設定の作成（KMSキー指定）
     */
    updateBucketEncryption(requestParameters: UpdateBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpdateBucketEncryption200Response>;

    /**
     * Creates request options for updateBucketPlan without sending the request
     * @param {string} name バケット名
     * @param {PlanChangeReqBody} planChangeReqBody 
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    updateBucketPlanRequestOpts(requestParameters: UpdateBucketPlanRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * @summary プラン変更を実行
     * @param {string} name バケット名
     * @param {PlanChangeReqBody} planChangeReqBody 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    updateBucketPlanRaw(requestParameters: UpdateBucketPlanRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpdateBucketPlan200Response>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * プラン変更を実行
     */
    updateBucketPlan(requestParameters: UpdateBucketPlanRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpdateBucketPlan200Response>;

    /**
     * Creates request options for updatePermission without sending the request
     * @param {number} id パーミッションID
     * @param {PermissionBucketControlsBody} permissionBucketControlsBody どのバケットを制御するかを定義します。
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    updatePermissionRequestOpts(requestParameters: UpdatePermissionRequest): Promise<runtime.RequestOpts>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。  **注意**： 本APIは指定したパーミッションIDの内容を全て置き換えます。 そのため、一部のバケットの権限を変更したい場合であっても、本パーミッションIDが管理する全てのバケットに関する情報も合わせて送る必要があります。  例えば、パーミッションID`1`が管理するバケットが下記の内容であるとします（パーミッションID`1`をGETした際の内容を示しています）。 ``` {   \"data\": {     \"bucket_controls\": [       {         \"bucket_name\": \"your-bucket-name-001\",         \"can_read\": false,         \"can_write\": false,         \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"       },       {         \"bucket_name\": \"your-bucket-name-002\",         \"can_read\": false,         \"can_write\": false,         \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"       }     ]     \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"     \"display_name\": \"your-permission-001\",     \"id\": 1   }, } ``` この内、`your-bucket-name-002`の読み込み及び書き込み権限だけを許可したい場合は下記のようなリクエストボディーを送る必要があります。 ``` {   \"id\": 1,   \"display_name\": \"your-permission-001\",   \"bucket_controls\": [     {       \"bucket_name\": \"your-bucket-name-001\",       \"can_read\": false,       \"can_write\": false,     },     {       \"bucket_name\": \"your-bucket-name-002\",       \"can_read\": true,       \"can_write\": true,     }   ] } ```  実際にリクエストを送る際には上記の内容を`data.json`というファイルに保存し、以下のような入力を行います。 ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X PUT \\      -d @data.json \\ https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/permissions/1 ```
     * @summary パーミッションの更新
     * @param {number} id パーミッションID
     * @param {PermissionBucketControlsBody} permissionBucketControlsBody どのバケットを制御するかを定義します。
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    updatePermissionRaw(requestParameters: UpdatePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Permission>>;

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。  **注意**： 本APIは指定したパーミッションIDの内容を全て置き換えます。 そのため、一部のバケットの権限を変更したい場合であっても、本パーミッションIDが管理する全てのバケットに関する情報も合わせて送る必要があります。  例えば、パーミッションID`1`が管理するバケットが下記の内容であるとします（パーミッションID`1`をGETした際の内容を示しています）。 ``` {   \"data\": {     \"bucket_controls\": [       {         \"bucket_name\": \"your-bucket-name-001\",         \"can_read\": false,         \"can_write\": false,         \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"       },       {         \"bucket_name\": \"your-bucket-name-002\",         \"can_read\": false,         \"can_write\": false,         \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"       }     ]     \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"     \"display_name\": \"your-permission-001\",     \"id\": 1   }, } ``` この内、`your-bucket-name-002`の読み込み及び書き込み権限だけを許可したい場合は下記のようなリクエストボディーを送る必要があります。 ``` {   \"id\": 1,   \"display_name\": \"your-permission-001\",   \"bucket_controls\": [     {       \"bucket_name\": \"your-bucket-name-001\",       \"can_read\": false,       \"can_write\": false,     },     {       \"bucket_name\": \"your-bucket-name-002\",       \"can_read\": true,       \"can_write\": true,     }   ] } ```  実際にリクエストを送る際には上記の内容を`data.json`というファイルに保存し、以下のような入力を行います。 ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X PUT \\      -d @data.json \\ https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/permissions/1 ```
     * パーミッションの更新
     */
    updatePermission(requestParameters: UpdatePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Permission>;

}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI implements DefaultApiInterface {

    /**
     * Creates request options for createAccount without sending the request
     */
    async createAccountRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/account`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントの作成
     */
    async createAccountRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Account>> {
        const requestOptions = await this.createAccountRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccountFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントの作成
     */
    async createAccount(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Account> {
        const response = await this.createAccountRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for createAccountKey without sending the request
     */
    async createAccountKeyRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/account/keys`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの発行
     */
    async createAccountKeyRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccountKey>> {
        const requestOptions = await this.createAccountKeyRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccountKeyFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの発行
     */
    async createAccountKey(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccountKey> {
        const response = await this.createAccountKeyRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for createBucket without sending the request
     */
    async createBucketRequestOpts(requestParameters: CreateBucketRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling createBucket().'
            );
        }

        if (requestParameters['handlerCreateBucketRequestBody'] == null) {
            throw new runtime.RequiredError(
                'handlerCreateBucketRequestBody',
                'Required parameter "handlerCreateBucketRequestBody" was null or undefined when calling createBucket().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: HandlerCreateBucketRequestBodyToJSON(requestParameters['handlerCreateBucketRequestBody']),
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットの作成
     */
    async createBucketRaw(requestParameters: CreateBucketRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerCreateBucketResponse>> {
        const requestOptions = await this.createBucketRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlerCreateBucketResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットの作成
     */
    async createBucket(requestParameters: CreateBucketRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerCreateBucketResponse> {
        const response = await this.createBucketRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for createBucketReplication without sending the request
     */
    async createBucketReplicationRequestOpts(requestParameters: CreateBucketReplicationOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling createBucketReplication().'
            );
        }

        if (requestParameters['createBucketReplicationRequest'] == null) {
            throw new runtime.RequiredError(
                'createBucketReplicationRequest',
                'Required parameter "createBucketReplicationRequest" was null or undefined when calling createBucketReplication().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/replication`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateBucketReplicationRequestToJSON(requestParameters['createBucketReplicationRequest']),
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットのレプリケーション設定の作成
     */
    async createBucketReplicationRaw(requestParameters: CreateBucketReplicationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerCreateBucketReplicationResponse>> {
        const requestOptions = await this.createBucketReplicationRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlerCreateBucketReplicationResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットのレプリケーション設定の作成
     */
    async createBucketReplication(requestParameters: CreateBucketReplicationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerCreateBucketReplicationResponse> {
        const response = await this.createBucketReplicationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for createPermission without sending the request
     */
    async createPermissionRequestOpts(requestParameters: CreatePermissionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['permissionBucketControlsBody'] == null) {
            throw new runtime.RequiredError(
                'permissionBucketControlsBody',
                'Required parameter "permissionBucketControlsBody" was null or undefined when calling createPermission().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/permissions`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PermissionBucketControlsBodyToJSON(requestParameters['permissionBucketControlsBody']),
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションの作成
     */
    async createPermissionRaw(requestParameters: CreatePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Permission>> {
        const requestOptions = await this.createPermissionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PermissionFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションの作成
     */
    async createPermission(requestParameters: CreatePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Permission> {
        const response = await this.createPermissionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for createPermissionKey without sending the request
     */
    async createPermissionKeyRequestOpts(requestParameters: CreatePermissionKeyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling createPermissionKey().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/permissions/{id}/keys`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションのアクセスキーの発行
     */
    async createPermissionKeyRaw(requestParameters: CreatePermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerCreatePermissionKeyResponse>> {
        const requestOptions = await this.createPermissionKeyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlerCreatePermissionKeyResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションのアクセスキーの発行
     */
    async createPermissionKey(requestParameters: CreatePermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerCreatePermissionKeyResponse> {
        const response = await this.createPermissionKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for deleteAccount without sending the request
     */
    async deleteAccountRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/account`;

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントの削除
     */
    async deleteAccountRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteAccountRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントの削除
     */
    async deleteAccount(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAccountRaw(initOverrides);
    }

    /**
     * Creates request options for deleteAccountKey without sending the request
     */
    async deleteAccountKeyRequestOpts(requestParameters: DeleteAccountKeyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling deleteAccountKey().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/account/keys/{id}`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの削除
     */
    async deleteAccountKeyRaw(requestParameters: DeleteAccountKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteAccountKeyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの削除
     */
    async deleteAccountKey(requestParameters: DeleteAccountKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAccountKeyRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for deleteBucket without sending the request
     */
    async deleteBucketRequestOpts(requestParameters: DeleteBucketRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling deleteBucket().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットの削除
     */
    async deleteBucketRaw(requestParameters: DeleteBucketRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteBucketRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットの削除
     */
    async deleteBucket(requestParameters: DeleteBucketRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteBucketRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for deleteBucketEncryption without sending the request
     */
    async deleteBucketEncryptionRequestOpts(requestParameters: DeleteBucketEncryptionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling deleteBucketEncryption().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/encryption`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット暗号化設定の削除（無効化）
     */
    async deleteBucketEncryptionRaw(requestParameters: DeleteBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteBucketEncryptionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット暗号化設定の削除（無効化）
     */
    async deleteBucketEncryption(requestParameters: DeleteBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteBucketEncryptionRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for deleteBucketReplication without sending the request
     */
    async deleteBucketReplicationRequestOpts(requestParameters: DeleteBucketReplicationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling deleteBucketReplication().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/replication`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * レプリケーション設定の削除
     */
    async deleteBucketReplicationRaw(requestParameters: DeleteBucketReplicationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteBucketReplicationRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * レプリケーション設定の削除
     */
    async deleteBucketReplication(requestParameters: DeleteBucketReplicationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteBucketReplicationRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for deletePermission without sending the request
     */
    async deletePermissionRequestOpts(requestParameters: DeletePermissionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling deletePermission().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/permissions/{id}`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションの削除
     */
    async deletePermissionRaw(requestParameters: DeletePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deletePermissionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションの削除
     */
    async deletePermission(requestParameters: DeletePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deletePermissionRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for deletePermissionKey without sending the request
     */
    async deletePermissionKeyRequestOpts(requestParameters: DeletePermissionKeyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling deletePermissionKey().'
            );
        }

        if (requestParameters['keyId'] == null) {
            throw new runtime.RequiredError(
                'keyId',
                'Required parameter "keyId" was null or undefined when calling deletePermissionKey().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/permissions/{id}/keys/{key_id}`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace('{key_id}', encodeURIComponent(String(requestParameters['keyId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションが保有するアクセスキーの削除
     */
    async deletePermissionKeyRaw(requestParameters: DeletePermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deletePermissionKeyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションが保有するアクセスキーの削除
     */
    async deletePermissionKey(requestParameters: DeletePermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deletePermissionKeyRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for listAccountKeys without sending the request
     */
    async listAccountKeysRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/account/keys`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの取得
     */
    async listAccountKeysRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccountKeys>> {
        const requestOptions = await this.listAccountKeysRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccountKeysFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの取得
     */
    async listAccountKeys(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccountKeys> {
        const response = await this.listAccountKeysRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listBucketMetering without sending the request
     */
    async listBucketMeteringRequestOpts(requestParameters: ListBucketMeteringRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling listBucketMetering().'
            );
        }

        if (requestParameters['from'] == null) {
            throw new runtime.RequiredError(
                'from',
                'Required parameter "from" was null or undefined when calling listBucketMetering().'
            );
        }

        if (requestParameters['to'] == null) {
            throw new runtime.RequiredError(
                'to',
                'Required parameter "to" was null or undefined when calling listBucketMetering().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/metering/buckets/{name}`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。  指定したバケットの使用量を、指定した月範囲で取得します。 取得できるデータは月次集計データとなり、日次や時間毎の詳細なデータは取得できません。 また、指定した月においてバケットの使用が無かった場合でも、ゼロ埋めされたデータが返却されます。
     * バケット使用量の取得
     */
    async listBucketMeteringRaw(requestParameters: ListBucketMeteringRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListBucketMetering200Response>> {
        const requestOptions = await this.listBucketMeteringRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListBucketMetering200ResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。  指定したバケットの使用量を、指定した月範囲で取得します。 取得できるデータは月次集計データとなり、日次や時間毎の詳細なデータは取得できません。 また、指定した月においてバケットの使用が無かった場合でも、ゼロ埋めされたデータが返却されます。
     * バケット使用量の取得
     */
    async listBucketMetering(requestParameters: ListBucketMeteringRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListBucketMetering200Response> {
        const response = await this.listBucketMeteringRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listBucketReplicableTargets without sending the request
     */
    async listBucketReplicableTargetsRequestOpts(requestParameters: ListBucketReplicableTargetsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling listBucketReplicableTargets().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/replicable-targets`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットのレプリケーション設定可能なディスティネーションバケットを取得
     */
    async listBucketReplicableTargetsRaw(requestParameters: ListBucketReplicableTargetsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerListBucketReplicableTargetsResponse>> {
        const requestOptions = await this.listBucketReplicableTargetsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlerListBucketReplicableTargetsResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットのレプリケーション設定可能なディスティネーションバケットを取得
     */
    async listBucketReplicableTargets(requestParameters: ListBucketReplicableTargetsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerListBucketReplicableTargetsResponse> {
        const response = await this.listBucketReplicableTargetsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listBuckets without sending the request
     */
    async listBucketsRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット一覧の取得
     */
    async listBucketsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerListBucketsResponse>> {
        const requestOptions = await this.listBucketsRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlerListBucketsResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット一覧の取得
     */
    async listBuckets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerListBucketsResponse> {
        const response = await this.listBucketsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listClusters without sending the request
     */
    async listClustersRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/clusters`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * サイト一覧の取得
     */
    async listClustersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerListClustersResponse>> {
        const requestOptions = await this.listClustersRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlerListClustersResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * サイト一覧の取得
     */
    async listClusters(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerListClustersResponse> {
        const response = await this.listClustersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listPermissionKeys without sending the request
     */
    async listPermissionKeysRequestOpts(requestParameters: ListPermissionKeysRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling listPermissionKeys().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/permissions/{id}/keys`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションが保有するアクセスキー一覧の取得
     */
    async listPermissionKeysRaw(requestParameters: ListPermissionKeysRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerListPermissionKeysResponse>> {
        const requestOptions = await this.listPermissionKeysRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlerListPermissionKeysResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションが保有するアクセスキー一覧の取得
     */
    async listPermissionKeys(requestParameters: ListPermissionKeysRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerListPermissionKeysResponse> {
        const response = await this.listPermissionKeysRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listPermissions without sending the request
     */
    async listPermissionsRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/permissions`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッション一覧の取得
     */
    async listPermissionsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Permissions>> {
        const requestOptions = await this.listPermissionsRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PermissionsFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッション一覧の取得
     */
    async listPermissions(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Permissions> {
        const response = await this.listPermissionsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listPlans without sending the request
     */
    async listPlansRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/plans`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * 利用可能なプランの一覧取得
     */
    async listPlansRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListPlans200Response>> {
        const requestOptions = await this.listPlansRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListPlans200ResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * 利用可能なプランの一覧取得
     */
    async listPlans(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListPlans200Response> {
        const response = await this.listPlansRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readAccount without sending the request
     */
    async readAccountRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/account`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントの取得
     */
    async readAccountRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Account>> {
        const requestOptions = await this.readAccountRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccountFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントの取得
     */
    async readAccount(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Account> {
        const response = await this.readAccountRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readAccountKey without sending the request
     */
    async readAccountKeyRequestOpts(requestParameters: ReadAccountKeyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling readAccountKey().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/account/keys/{id}`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの取得
     */
    async readAccountKeyRaw(requestParameters: ReadAccountKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ReadAccountKey>> {
        const requestOptions = await this.readAccountKeyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ReadAccountKeyFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトアカウントのアクセスキーの取得
     */
    async readAccountKey(requestParameters: ReadAccountKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ReadAccountKey> {
        const response = await this.readAccountKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readBucketEncryption without sending the request
     */
    async readBucketEncryptionRequestOpts(requestParameters: ReadBucketEncryptionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling readBucketEncryption().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/encryption`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット暗号化設定の取得
     */
    async readBucketEncryptionRaw(requestParameters: ReadBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ReadBucketEncryption200Response>> {
        const requestOptions = await this.readBucketEncryptionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ReadBucketEncryption200ResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット暗号化設定の取得
     */
    async readBucketEncryption(requestParameters: ReadBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ReadBucketEncryption200Response> {
        const response = await this.readBucketEncryptionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readBucketPenalty without sending the request
     */
    async readBucketPenaltyRequestOpts(requestParameters: ReadBucketPenaltyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling readBucketPenalty().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/penalty`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケットのペナルティ状況を取得
     */
    async readBucketPenaltyRaw(requestParameters: ReadBucketPenaltyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BucketPenalty>> {
        const requestOptions = await this.readBucketPenaltyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BucketPenaltyFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケットのペナルティ状況を取得
     */
    async readBucketPenalty(requestParameters: ReadBucketPenaltyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BucketPenalty> {
        const response = await this.readBucketPenaltyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readBucketPlan without sending the request
     */
    async readBucketPlanRequestOpts(requestParameters: ReadBucketPlanRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling readBucketPlan().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/plan`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * 現在のプランを取得
     */
    async readBucketPlanRaw(requestParameters: ReadBucketPlanRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ReadBucketPlan200Response>> {
        const requestOptions = await this.readBucketPlanRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ReadBucketPlan200ResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * 現在のプランを取得
     */
    async readBucketPlan(requestParameters: ReadBucketPlanRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ReadBucketPlan200Response> {
        const response = await this.readBucketPlanRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readBucketQuota without sending the request
     */
    async readBucketQuotaRequestOpts(requestParameters: ReadBucketQuotaRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling readBucketQuota().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/quota`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケットの制限値を取得
     */
    async readBucketQuotaRaw(requestParameters: ReadBucketQuotaRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BucketQuota>> {
        const requestOptions = await this.readBucketQuotaRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BucketQuotaFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケットの制限値を取得
     */
    async readBucketQuota(requestParameters: ReadBucketQuotaRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BucketQuota> {
        const response = await this.readBucketQuotaRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readBucketReplication without sending the request
     */
    async readBucketReplicationRequestOpts(requestParameters: ReadBucketReplicationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling readBucketReplication().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/replication`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットのレプリケーション設定の取得
     */
    async readBucketReplicationRaw(requestParameters: ReadBucketReplicationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerReadBucketReplicationResponse>> {
        const requestOptions = await this.readBucketReplicationRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlerReadBucketReplicationResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * バケットのレプリケーション設定の取得
     */
    async readBucketReplication(requestParameters: ReadBucketReplicationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerReadBucketReplicationResponse> {
        const response = await this.readBucketReplicationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readBucketUsage without sending the request
     */
    async readBucketUsageRequestOpts(requestParameters: ReadBucketUsageRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling readBucketUsage().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/usage`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケットの使用量を取得
     */
    async readBucketUsageRaw(requestParameters: ReadBucketUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BucketUsage>> {
        const requestOptions = await this.readBucketUsageRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BucketUsageFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケットの使用量を取得
     */
    async readBucketUsage(requestParameters: ReadBucketUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BucketUsage> {
        const response = await this.readBucketUsageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readCluster without sending the request
     */
    async readClusterRequestOpts(requestParameters: ReadClusterRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling readCluster().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/clusters/{id}`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * サイトの取得
     */
    async readClusterRaw(requestParameters: ReadClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerReadClusterResponse>> {
        const requestOptions = await this.readClusterRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlerReadClusterResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/clusters` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/fed/v1/clusters` となります。
     * サイトの取得
     */
    async readCluster(requestParameters: ReadClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerReadClusterResponse> {
        const response = await this.readClusterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readPermission without sending the request
     */
    async readPermissionRequestOpts(requestParameters: ReadPermissionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling readPermission().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/permissions/{id}`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションの取得
     */
    async readPermissionRaw(requestParameters: ReadPermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Permission>> {
        const requestOptions = await this.readPermissionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PermissionFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションの取得
     */
    async readPermission(requestParameters: ReadPermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Permission> {
        const response = await this.readPermissionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readPermissionKey without sending the request
     */
    async readPermissionKeyRequestOpts(requestParameters: ReadPermissionKeyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling readPermissionKey().'
            );
        }

        if (requestParameters['keyId'] == null) {
            throw new runtime.RequiredError(
                'keyId',
                'Required parameter "keyId" was null or undefined when calling readPermissionKey().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/permissions/{id}/keys/{key_id}`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace('{key_id}', encodeURIComponent(String(requestParameters['keyId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションが保有するアクセスキーの取得
     */
    async readPermissionKeyRaw(requestParameters: ReadPermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HandlerReadPermissionKeyResponse>> {
        const requestOptions = await this.readPermissionKeyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HandlerReadPermissionKeyResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * パーミッションが保有するアクセスキーの取得
     */
    async readPermissionKey(requestParameters: ReadPermissionKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HandlerReadPermissionKeyResponse> {
        const response = await this.readPermissionKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readQuota without sending the request
     */
    async readQuotaRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/quota`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * 全体制限値の取得
     */
    async readQuotaRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Quota>> {
        const requestOptions = await this.readQuotaRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => QuotaFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * 全体制限値の取得
     */
    async readQuota(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Quota> {
        const response = await this.readQuotaRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readStatus without sending the request
     */
    async readStatusRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/status`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトのステータスの取得
     */
    async readStatusRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Status>> {
        const requestOptions = await this.readStatusRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatusFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * サイトのステータスの取得
     */
    async readStatus(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Status> {
        const response = await this.readStatusRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for updateBucketEncryption without sending the request
     */
    async updateBucketEncryptionRequestOpts(requestParameters: UpdateBucketEncryptionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling updateBucketEncryption().'
            );
        }

        if (requestParameters['handlerUpdateBucketEncryptionRequestBody'] == null) {
            throw new runtime.RequiredError(
                'handlerUpdateBucketEncryptionRequestBody',
                'Required parameter "handlerUpdateBucketEncryptionRequestBody" was null or undefined when calling updateBucketEncryption().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/encryption`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: HandlerUpdateBucketEncryptionRequestBodyToJSON(requestParameters['handlerUpdateBucketEncryptionRequestBody']),
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット暗号化設定の作成（KMSキー指定）
     */
    async updateBucketEncryptionRaw(requestParameters: UpdateBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpdateBucketEncryption200Response>> {
        const requestOptions = await this.updateBucketEncryptionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UpdateBucketEncryption200ResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * バケット暗号化設定の作成（KMSキー指定）
     */
    async updateBucketEncryption(requestParameters: UpdateBucketEncryptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpdateBucketEncryption200Response> {
        const response = await this.updateBucketEncryptionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for updateBucketPlan without sending the request
     */
    async updateBucketPlanRequestOpts(requestParameters: UpdateBucketPlanRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling updateBucketPlan().'
            );
        }

        if (requestParameters['planChangeReqBody'] == null) {
            throw new runtime.RequiredError(
                'planChangeReqBody',
                'Required parameter "planChangeReqBody" was null or undefined when calling updateBucketPlan().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/buckets/{name}/plan`;
        urlPath = urlPath.replace('{name}', encodeURIComponent(String(requestParameters['name'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: PlanChangeReqBodyToJSON(requestParameters['planChangeReqBody']),
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * プラン変更を実行
     */
    async updateBucketPlanRaw(requestParameters: UpdateBucketPlanRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpdateBucketPlan200Response>> {
        const requestOptions = await this.updateBucketPlanRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UpdateBucketPlan200ResponseFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。
     * プラン変更を実行
     */
    async updateBucketPlan(requestParameters: UpdateBucketPlanRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpdateBucketPlan200Response> {
        const response = await this.updateBucketPlanRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for updatePermission without sending the request
     */
    async updatePermissionRequestOpts(requestParameters: UpdatePermissionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling updatePermission().'
            );
        }

        if (requestParameters['permissionBucketControlsBody'] == null) {
            throw new runtime.RequiredError(
                'permissionBucketControlsBody',
                'Required parameter "permissionBucketControlsBody" was null or undefined when calling updatePermission().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }

        let urlPath = `/permissions/{id}`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: PermissionBucketControlsBodyToJSON(requestParameters['permissionBucketControlsBody']),
        };
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。  **注意**： 本APIは指定したパーミッションIDの内容を全て置き換えます。 そのため、一部のバケットの権限を変更したい場合であっても、本パーミッションIDが管理する全てのバケットに関する情報も合わせて送る必要があります。  例えば、パーミッションID`1`が管理するバケットが下記の内容であるとします（パーミッションID`1`をGETした際の内容を示しています）。 ``` {   \"data\": {     \"bucket_controls\": [       {         \"bucket_name\": \"your-bucket-name-001\",         \"can_read\": false,         \"can_write\": false,         \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"       },       {         \"bucket_name\": \"your-bucket-name-002\",         \"can_read\": false,         \"can_write\": false,         \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"       }     ]     \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"     \"display_name\": \"your-permission-001\",     \"id\": 1   }, } ``` この内、`your-bucket-name-002`の読み込み及び書き込み権限だけを許可したい場合は下記のようなリクエストボディーを送る必要があります。 ``` {   \"id\": 1,   \"display_name\": \"your-permission-001\",   \"bucket_controls\": [     {       \"bucket_name\": \"your-bucket-name-001\",       \"can_read\": false,       \"can_write\": false,     },     {       \"bucket_name\": \"your-bucket-name-002\",       \"can_read\": true,       \"can_write\": true,     }   ] } ```  実際にリクエストを送る際には上記の内容を`data.json`というファイルに保存し、以下のような入力を行います。 ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X PUT \\      -d @data.json \\ https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/permissions/1 ```
     * パーミッションの更新
     */
    async updatePermissionRaw(requestParameters: UpdatePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Permission>> {
        const requestOptions = await this.updatePermissionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PermissionFromJSON(jsonValue));
    }

    /**
     * アクセス先ベースURL: `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/`  上記アクセス先ベースURLと右ペインのパスを組み合わせたものがアクセス先URLになります。 例えば、右ペインのパスが `/account` の場合、アクセス先URLは、 `https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/account` となります。  なお、サイト名の取得方法は「利用例＞接続先サイト一覧の取得」をご参考下さい。  **注意**： 本APIは指定したパーミッションIDの内容を全て置き換えます。 そのため、一部のバケットの権限を変更したい場合であっても、本パーミッションIDが管理する全てのバケットに関する情報も合わせて送る必要があります。  例えば、パーミッションID`1`が管理するバケットが下記の内容であるとします（パーミッションID`1`をGETした際の内容を示しています）。 ``` {   \"data\": {     \"bucket_controls\": [       {         \"bucket_name\": \"your-bucket-name-001\",         \"can_read\": false,         \"can_write\": false,         \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"       },       {         \"bucket_name\": \"your-bucket-name-002\",         \"can_read\": false,         \"can_write\": false,         \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"       }     ]     \"created_at\": \"2021-01-01T12:59:59.371074+09:00\"     \"display_name\": \"your-permission-001\",     \"id\": 1   }, } ``` この内、`your-bucket-name-002`の読み込み及び書き込み権限だけを許可したい場合は下記のようなリクエストボディーを送る必要があります。 ``` {   \"id\": 1,   \"display_name\": \"your-permission-001\",   \"bucket_controls\": [     {       \"bucket_name\": \"your-bucket-name-001\",       \"can_read\": false,       \"can_write\": false,     },     {       \"bucket_name\": \"your-bucket-name-002\",       \"can_read\": true,       \"can_write\": true,     }   ] } ```  実際にリクエストを送る際には上記の内容を`data.json`というファイルに保存し、以下のような入力を行います。 ``` # 入力サンプル curl -u \'01234567-89ab-cdef-0123-456789abcdef:SAMPLETOKENSAMPLETOKENSAMPLETOKENSAM\' \\      -X PUT \\      -d @data.json \\ https://secure.sakura.ad.jp/cloud/zone/is1a/api/objectstorage/1.0/（サイト名）/v2/permissions/1 ```
     * パーミッションの更新
     */
    async updatePermission(requestParameters: UpdatePermissionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Permission> {
        const response = await this.updatePermissionRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
