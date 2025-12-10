import { VerifyAppCheckTokenResponse } from "firebase-admin/app-check";
import { DocumentOptions } from "firebase-functions/v2/firestore";
import { HttpsOptions } from "firebase-functions/v2/https";
import { PubSubOptions } from "firebase-functions/v2/pubsub";
import { output, ZodType } from "zod";

import { TopicNames } from "../../services/pubsub.js";
import type { Maybe, OrPromise } from "../type.utils.js";

export type HttpHandlerFunctionConfig = HttpsOptions & {
  bodySchema?: ZodType;
  querySchema?: ZodType;
  responseSchema?: ZodType;
  loggerName?: string;
  useAppCheck?: boolean;
  requireAuthToken?: boolean;
  functionName?: string;
  rawHtmlResponse?: boolean;
};

export type HttpHandlerFunction<
  T extends HttpHandlerFunctionConfig,
  RequireAuthToken extends boolean = T["requireAuthToken"] extends boolean
    ? T["requireAuthToken"]
    : false,
  BodySchema extends ZodType | undefined = T["bodySchema"],
  QuerySchema extends ZodType | undefined = T["querySchema"],
  ResponseSchema extends ZodType | undefined = T["responseSchema"],
> = (payload: {
  body: BodySchema extends ZodType ? output<BodySchema> : unknown;
  query: QuerySchema extends ZodType ? output<QuerySchema> : unknown;
  headers: Record<string, string>;
  appCheckTokenResponse: T["useAppCheck"] extends true
    ? VerifyAppCheckTokenResponse
    : undefined;
  tokenPayload: RequireAuthToken extends true
    ? {
        email: string;
        firestoreId: string;
        sqlId: string;
      }
    : Record<string, string>;
}) => OrPromise<
  ResponseSchema extends ZodType
    ?
        | {
            statusCode: ErrorStatusCodes;
          }
        | {
            response: output<ResponseSchema>;
            statusCode?: OKStatusCodes;
          }
    : Maybe<{
        response?: unknown;
        statusCode?: number;
      }>
>;

export type PubSubHandlerFunctionConfig = PubSubOptions & {
  topic: TopicNames;
  bodySchema?: ZodType;
  loggerName?: string;
  functionName?: string;
};

export type PubSubHandlerFunction<
  T extends PubSubHandlerFunctionConfig,
  BodySchema extends ZodType | undefined = T["bodySchema"],
> = (
  body: BodySchema extends ZodType ? output<BodySchema> : unknown,
) => Promise<unknown>;

export type OnDocumentCreatedHandlerFunctionConfig<
  NewDocumentSchema extends ZodType | undefined,
  ParamsSchema extends ZodType | undefined,
  Document extends string,
> = DocumentOptions<Document> & {
  newDocumentSchema?: NewDocumentSchema;
  paramsSchema?: ParamsSchema;
  functionName?: string;
};

export type OnDocumentCreatedHandlerFunction<
  NewDocumentSchema extends ZodType | undefined,
  ParamsSchema extends ZodType | undefined,
> = (
  payload: NewDocumentSchema extends ZodType
    ? output<NewDocumentSchema>
    : unknown,
  params: ParamsSchema extends ZodType ? output<ParamsSchema> : unknown,
) => Promise<unknown>;

export type OnDocumentUpdateHandlerFunction<
  BeforeDocumentSchema extends ZodType | undefined,
  AfterDocumentSchema extends ZodType | undefined,
  ParamsSchema extends ZodType | undefined,
> = (
  before: BeforeDocumentSchema extends ZodType
    ? output<BeforeDocumentSchema>
    : unknown,
  after: AfterDocumentSchema extends ZodType
    ? output<AfterDocumentSchema>
    : unknown,
  params: ParamsSchema extends ZodType ? output<ParamsSchema> : unknown,
) => Promise<unknown>;

export type OnDocumentUpdateHandlerFunctionConfig<
  BeforeDocumentSchema extends ZodType | undefined,
  AfterDocumentSchema extends ZodType | undefined,
  ParamsSchema extends ZodType | undefined,
  Document extends string,
> = DocumentOptions<Document> & {
  beforeDocumentSchema?: BeforeDocumentSchema;
  afterDocumentSchema?: AfterDocumentSchema;
  paramsSchema?: ParamsSchema;
  functionName?: string;
};

type OKStatusCodes = 200 | 201 | 204;
type ErrorStatusCodes =
  | 400
  | 401
  | 403
  | 404
  | 405
  | 409
  | 422
  | 429
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511
  | 512
  | 599;
