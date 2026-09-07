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

import { mapValues } from '../runtime';
import type { BucketPenaltyDataNumObjectsPerBucket } from './BucketPenaltyDataNumObjectsPerBucket';
import {
    BucketPenaltyDataNumObjectsPerBucketFromJSON,
    BucketPenaltyDataNumObjectsPerBucketFromJSONTyped,
    BucketPenaltyDataNumObjectsPerBucketToJSON,
    BucketPenaltyDataNumObjectsPerBucketToJSONTyped,
} from './BucketPenaltyDataNumObjectsPerBucket';
import type { BucketPenaltyDataAmountGibPerBucket } from './BucketPenaltyDataAmountGibPerBucket';
import {
    BucketPenaltyDataAmountGibPerBucketFromJSON,
    BucketPenaltyDataAmountGibPerBucketFromJSONTyped,
    BucketPenaltyDataAmountGibPerBucketToJSON,
    BucketPenaltyDataAmountGibPerBucketToJSONTyped,
} from './BucketPenaltyDataAmountGibPerBucket';

/**
 * 
 * @export
 * @interface BucketPenaltyData
 */
export interface BucketPenaltyData {
    /**
     * 
     * @type {BucketPenaltyDataNumObjectsPerBucket}
     * @memberof BucketPenaltyData
     */
    numObjectsPerBucket: BucketPenaltyDataNumObjectsPerBucket;
    /**
     * 
     * @type {BucketPenaltyDataAmountGibPerBucket}
     * @memberof BucketPenaltyData
     */
    amountGibPerBucket: BucketPenaltyDataAmountGibPerBucket;
}

/**
 * Check if a given object implements the BucketPenaltyData interface.
 */
export function instanceOfBucketPenaltyData(value: object): value is BucketPenaltyData {
    if ((!('numObjectsPerBucket' in (value as Record<string, any>)) && !('num_objects_per_bucket' in (value as Record<string, any>))) || ((value as Record<string, any>)['numObjectsPerBucket'] === undefined && (value as Record<string, any>)['num_objects_per_bucket'] === undefined)) return false;
    if ((!('amountGibPerBucket' in (value as Record<string, any>)) && !('amount_gib_per_bucket' in (value as Record<string, any>))) || ((value as Record<string, any>)['amountGibPerBucket'] === undefined && (value as Record<string, any>)['amount_gib_per_bucket'] === undefined)) return false;
    return true;
}

export function BucketPenaltyDataFromJSON(json: any): BucketPenaltyData {
    return BucketPenaltyDataFromJSONTyped(json, false);
}

export function BucketPenaltyDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): BucketPenaltyData {
    if (json == null) {
        return json;
    }
    return {
        
        'numObjectsPerBucket': BucketPenaltyDataNumObjectsPerBucketFromJSON(json['num_objects_per_bucket']),
        'amountGibPerBucket': BucketPenaltyDataAmountGibPerBucketFromJSON(json['amount_gib_per_bucket']),
    };
}

export function BucketPenaltyDataToJSON(json: any): BucketPenaltyData {
    return BucketPenaltyDataToJSONTyped(json, false);
}

export function BucketPenaltyDataToJSONTyped(value?: BucketPenaltyData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'num_objects_per_bucket': BucketPenaltyDataNumObjectsPerBucketToJSON(value['numObjectsPerBucket']),
        'amount_gib_per_bucket': BucketPenaltyDataAmountGibPerBucketToJSON(value['amountGibPerBucket']),
    };
}

